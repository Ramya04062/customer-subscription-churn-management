
package com.churn.customer_churn_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

@Component
public class SnowflakeConfig {

    @Value("${snowflake.account}")
    private String account;

    @Value("${snowflake.username}")
    private String username;

    @Value("${snowflake.password}")
    private String password;

    @Value("${snowflake.warehouse}")
    private String warehouse;

    @Value("${snowflake.database}")
    private String database;

    @Value("${snowflake.schema}")
    private String schema;

    @Value("${snowflake.role}")
    private String role;

    public Connection getConnection() throws SQLException {

        String url = "jdbc:snowflake://"
                + account
                + ".snowflakecomputing.com/";

        Properties properties = new Properties();
        properties.put("user", username);
        properties.put("password", password);
        properties.put("warehouse", warehouse);
        properties.put("db", database);
        properties.put("schema", schema);
        properties.put("role", role);
        properties.put("JDBC_QUERY_RESULT_FORMAT", "JSON");

        return DriverManager.getConnection(url, properties);
    }
}
