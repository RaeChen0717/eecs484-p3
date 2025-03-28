// Query 6
// Find the average friend count per user.
// Return a decimal value as the average user friend count of all users in the users collection.

function find_average_friendcount(dbname) {
    db = db.getSiblingDB(dbname);

    // TODO: calculate the average friend count

    let result = db.users.aggregate([
        { $project: { friendCount: { $size: "$friends" } } },
        { $group: { _id: null, avgFriendCount: { $avg: "$friendCount" } } }
    ]).toArray();
    
    return result.length > 0 ? result[0].avgFriendCount : 0;
}
