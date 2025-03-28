// Query 1
// Find users who live in city "city".
// Return an array of user_ids. The order does not matter.

function find_user(city, dbname) {
    db = db.getSiblingDB(dbname);

    let results = [];
    let cursor = db.users.find({ city: city }, { user_id: 1, _id: 0 });
    // TODO: find all users who live in city
    // db.users.find(...);
    while (cursor.hasNext()) {
        let doc = cursor.next();
        results.push(doc.user_id);
    }
    
    // See test.js for a partial correctness check.

    return results;
}
