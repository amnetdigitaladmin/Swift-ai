import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const processConversion = async (sqlServerCode: string): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/convert`, {
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
    const response = await axios.post(`${API_URL}/convert-reverse`, {
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

export const optimizeSqlCode = async (sqlCode: string, sqlType: 'postgresql' | 'sqlserver'): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/optimize`, {
      sql_code: sqlCode,
      sql_type: sqlType,
      // In production, you would get this from environment variables
      openai_key: null // Using mock optimization for development
    });
    
    return response.data.optimized_code;
  } catch (error) {
    console.error('Optimization error:', error);
    throw new Error('Failed to optimize SQL code');
  }
};