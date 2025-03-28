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
    db.users.find({ gender: "male" }).forEach((maleUser) => {
        db.users.find({
            gender: "female",
            "hometown.city": maleUser.hometown.city,
            YOB: { $gt: maleUser.YOB - year_diff, $lt: maleUser.YOB + year_diff },
        }).forEach((femaleUser) => {
            if (maleUser.friends.indexOf(femaleUser.user_id) === -1 && femaleUser.friends.indexOf(maleUser.user_id) === -1) {
                pairs.push([maleUser.user_id, femaleUser.user_id]);
            } // Check if not friends already
        });
    });

    return pairs;
}

