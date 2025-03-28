// Query 1
// Find users who live in city "city".
// Return an array of user_ids. The order does not matter.

function find_user(city, dbname) {
    db = db.getSiblingDB(dbname);

    let results = [];
    // Query the users collection by matching the "current.city" field.
    let cursor = db.users.find({ "current.city": city }, { user_id: 1, _id: 0 });
    while (cursor.hasNext()) {
        let doc = cursor.next();
        results.push(doc.user_id);
    }
    
    return results;
}
