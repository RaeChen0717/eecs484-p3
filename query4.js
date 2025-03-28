// Query 4
// Find user pairs (A,B) that meet the following constraints:
// i) user A is male and user B is female
// ii) their Year_Of_Birth difference is less than year_diff
// iii) user A and B are not friends
// iv) user A and B are from the same hometown city
// The following is the schema for output pairs:
// [
//      [user_id1, user_id2],
//      [user_id1, user_id3],
//      [user_id4, user_id2],
//      ...
//  ]
// user_id is the field from the users collection. Do not use the _id field in users.
// Return an array of arrays.

function suggest_friends(year_diff, dbname) {
    db = db.getSiblingDB(dbname);

    let pairs = [];

    // TODO: implement suggest friends
    let pipeline = [
        { $match: { gender: "male" } },
        {
            $lookup: {
                from: "users",
                let: { 
                    city: "$hometown_city", 
                    a_year: "$Year_Of_Birth", 
                    a_friends: "$friends", 
                    a_id: "$user_id"
                },
                pipeline: [
                    { $match: { gender: "female" } },
                    { $match: { $expr: { $eq: ["$hometown_city", "$$city"] } } },
                    { $match: { 
                        $expr: { 
                            $lt: [ { $abs: { $subtract: ["$Year_Of_Birth", "$$a_year"] } }, year_diff ] 
                        } 
                    } },
                    { $match: { 
                        $expr: { 
                            $eq: [ { $in: ["$user_id", "$$a_friends"] }, false ]
                        } 
                    } }
                ],
                as: "femaleMatches"
            }
        },
        { $unwind: "$femaleMatches" },
        {
            $project: {
                _id: 0,
                pair: ["$user_id", "$femaleMatches.user_id"]
            }
        }
    ];
    let results = db.users.aggregate(pipeline).toArray();
    pairs = results.map(doc => doc.pair);

    return pairs;
}
