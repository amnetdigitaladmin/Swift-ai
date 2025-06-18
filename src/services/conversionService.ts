import axios from 'axios';

const API_URL = 'https://orj6b5t266fqvdz55dvxlosh6e0fsoqb.lambda-url.ap-south-1.on.aws/';

export const processConversion = async (sqlServerCode: string): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}`, {
      sql_server_code: sqlServerCode,
      // In production, you would get this from environment variables
      openai_key: null // Using mock conversion for development
    });
    
    return response.data.postgresql_code;
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error('Failed to convert SQL code');
  }
};

export const processReverseConversion = async (postgresCode: string): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}`, {
      postgresql_code: postgresCode,
      // In production, you would get this from environment variables
      openai_key: null // Using mock conversion for development
    });
    
    return response.data.sql_server_code;
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error('Failed to convert PostgreSQL code to SQL Server');
  }
};

export const sqlConversion = async (Query: string,conversion_type): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}`, {
      code: Query,
      function_type : conversion_type
    });
    
    return response.data;
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error('Failed to convert Query');
  }
};

export const optimizeSqlCode = async (sqlCode: string, sqlType: any): Promise<string> => {
  try {

    // if(sqlType == "sqlserver"){
    //   sqlType = "SQL SERVER"
    // } else {
    //   sqlType = "Postgres SQL"

    // }
    const response = await axios.post(`${API_URL}`, {
      code: sqlCode,
      "function_type" : "optimize_sql_function",
      sql_type: sqlType,
    });
    
    return response.data;
  } catch (error) {
    console.error('Optimization error:', error);
    throw new Error('Failed to optimize SQL code');
  }
};