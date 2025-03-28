// Query 5
// Find the oldest friend for each user who has a friend. For simplicity,
// use only year of birth to determine age, if there is a tie, use the
// one with smallest user_id. You may find query 2 and query 3 helpful.
// You can create selections if you want. Do not modify users collection.
// Return a javascript object : key is the user_id and the value is the oldest_friend id.
// You should return something like this (order does not matter):
// {user1:userx1, user2:userx2, user3:userx3,...}

function oldest_friend(dbname) {
    db = db.getSiblingDB(dbname);

    // Retrieve all users.
    let users = db.users.find().toArray();
    let userMap = {};
    users.forEach(function(user) {
        userMap[user.user_id] = user;
    });

    // Build a bidirectional friendship mapping.
    let friendship = {};
    users.forEach(function(user) {
        friendship[user.user_id] = [];
    });
    // Each user's friends array lists only friends with larger user_ids.
    // We add the reverse relation so every friendship is considered.
    users.forEach(function(user) {
        if (user.friends && Array.isArray(user.friends)) {
            user.friends.forEach(function(friendId) {
                friendship[user.user_id].push(friendId);
                if (!friendship[friendId]) {
                    friendship[friendId] = [];
                }
                if (friendship[friendId].indexOf(user.user_id) === -1) {
                    friendship[friendId].push(user.user_id);
                }
            });
        }
    });

    let result = {};
    // For each user, find the oldest friend.
    for (let uid in friendship) {
        let friendList = friendship[uid];
        if (friendList.length > 0) {
            let oldest = null;
            friendList.forEach(function(fid) {
                let friendDoc = userMap[fid];
                if (!friendDoc) return;
                if (oldest === null) {
                    oldest = friendDoc;
                } else {
                    if (friendDoc.YOB < oldest.YOB) {
                        oldest = friendDoc;
                    } else if (friendDoc.YOB === oldest.YOB && friendDoc.user_id < oldest.user_id) {
                        oldest = friendDoc;
                    }
                }
            });
            result[uid] = oldest.user_id;
        }
    }
    
    return result;
}
