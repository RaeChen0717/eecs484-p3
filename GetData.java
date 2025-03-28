import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.TreeSet;
import java.util.Vector;

import org.json.JSONObject;
import org.json.JSONArray;

public class GetData {

    static String prefix = "project3.";

    // You must use the following variable as the JDBC connection
    Connection oracleConnection = null;

    // You must refer to the following variables for the corresponding 
    // tables in your database
    String userTableName = null;
    String friendsTableName = null;
    String cityTableName = null;
    String currentCityTableName = null;
    String hometownCityTableName = null;

    // DO NOT modify this constructor
    public GetData(String u, Connection c) {
        super();
        String dataType = u;
        oracleConnection = c;
        userTableName = prefix + dataType + "_USERS";
        friendsTableName = prefix + dataType + "_FRIENDS";
        cityTableName = prefix + dataType + "_CITIES";
        currentCityTableName = prefix + dataType + "_USER_CURRENT_CITIES";
        hometownCityTableName = prefix + dataType + "_USER_HOMETOWN_CITIES";
    }

    // TODO: Implement this function
    @SuppressWarnings("unchecked")
    public JSONArray toJSON() throws SQLException {

        // This is the data structure to store all users' information
        JSONArray users_info = new JSONArray();
        
        try (Statement stmt = oracleConnection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY)) {
            // Your implementation goes here....
            Statement stmt2 = oracleConnection.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            ResultSet rst = stmt.executeQuery(
                "SELECT u.user_id, u.first_name, u.last_name, u.year_of_birth AS YOB, u.month_of_birth AS MOB, u.day_of_birth AS DOB, u.gender, h.city_name AS hometown_city, h.state_name AS hometown_state, h.country_name AS hometown_country, c.city_name AS current_city, c.state_name AS current_state, c.country_name AS current_country " +
                "FROM " + userTableName + " u " +
                "LEFT JOIN " + hometownCityTableName + " uhc ON u.user_id = uhc.user_id " +
                "LEFT JOIN " + cityTableName + " h " + " ON uhc.hometown_city_id = h.city_id " +
                "LEFT JOIN " + currentCityTableName + " ucc ON u.user_id = ucc.user_id " +
                "LEFT JOIN " + cityTableName + " c ON ucc.current_city_id = c.city_id " +
                "ORDER BY u.user_id"
            );

            while (rst.next()) {
                Long user_id = rst.getLong(1);
                String first_name = rst.getString(2);
                String last_name = rst.getString(3);
                Long YOB = rst.getLong(4);
                Long MOB = rst.getLong(5);
                Long DOB = rst.getLong(6);
                String gender = rst.getString(7);
                // Construct hometown json object
                String hometown_city = rst.getString(8);
                String hometown_state = rst.getString(9);
                String hometown_country = rst.getString(10);
                JSONObject hometown = new JSONObject();
                hometown.put("country", hometown_country);
                hometown.put("city", hometown_city);
                hometown.put("state", hometown_state);
                // Construct current json object
                String current_city = rst.getString(11);
                String current_state = rst.getString(12);
                String current_country = rst.getString(13);
                JSONObject current = new JSONObject();
                current.put("country", current_country);
                current.put("city", current_city);
                current.put("state", current_state);
                ResultSet friends = stmt2.executeQuery(
                    "SELECT user2_id " +
                    "FROM " + friendsTableName + " " +
                    "WHERE user1_id = " + user_id
                );
                JSONArray fri_lists = new JSONArray();
                while (friends.next()) {
                    fri_lists.put(friends.getLong(1));
                }
                JSONObject user_info = new JSONObject();
                user_info.put("MOB", MOB);
                user_info.put("hometown", hometown);
                user_info.put("current", current);
                user_info.put("gender", gender);
                user_info.put("user_id", user_id);
                user_info.put("DOB", DOB);
                user_info.put("last_name", last_name);
                user_info.put("first_name", first_name);
                user_info.put("YOB", YOB);
                user_info.put("friends", fri_lists);
                users_info.put(user_info);
                friends.close();
            }
            
            rst.close();
            stmt2.close();
            stmt.close();
            
            stmt.close();
        } catch (SQLException e) {
            System.err.println(e.getMessage());
        }

        return users_info;
    }

    // This outputs to a file "output.json"
    // DO NOT MODIFY this function
    public void writeJSON(JSONArray users_info) {
        try {
            FileWriter file = new FileWriter(System.getProperty("user.dir") + "/output.json");
            file.write(users_info.toString());
            file.flush();
            file.close();

        } catch (IOException e) {
            e.printStackTrace();
        }

    }
}
