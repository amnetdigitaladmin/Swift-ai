import axios from "axios";

const API_URL =
  "https://orj6b5t266fqvdz55dvxlosh6e0fsoqb.lambda-url.ap-south-1.on.aws/";

const CodeConversion_API_URL = 
  "https://zpxkfmja6x5nrvo42iqq2hbozm0ayxvr.lambda-url.ap-south-1.on.aws/";

export const processConversion = async (
  sqlServerCode: string
): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}`, {
      sql_server_code: sqlServerCode,
      // In production, you would get this from environment variables
      openai_key: null, // Using mock conversion for development
    });

    return response.data.postgresql_code;
  } catch (error) {
    console.error("Conversion error:", error);
    throw new Error("Failed to convert SQL code");
  }
};

export const processReverseConversion = async (
  postgresCode: string
): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}`, {
      postgresql_code: postgresCode,
      // In production, you would get this from environment variables
      openai_key: null, // Using mock conversion for development
    });

    return response.data.sql_server_code;
  } catch (error) {
    console.error("Conversion error:", error);
    throw new Error("Failed to convert PostgreSQL code to SQL Server");
  }
};

export const sqlConversion = async (
  Query: string,
  sourceType: any,
  targetType: any
): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}`, {
      source_code: Query,
      source_type: sourceType,
      target_type: targetType,
    });

    return response.data;
  } catch (error) {
    console.error("Conversion error:", error);
    throw new Error("Failed to convert Query");
  }
};

export type ConversionResult = {
  input_code_explanation: string | null;
  target_code: string | null;
  target_code_explanation: string | null;
  valid_input: boolean;
  validation_message?: string;
};

export const codeConversion = async (
  sourceCode: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<ConversionResult> => {
  try {
    const response = await axios.post(`${CodeConversion_API_URL}`, {
      "source_language": sourceLanguage,
      "target_language": targetLanguage,
      "input_code":sourceCode
    });

    return response.data.translated_code as ConversionResult ;
  } catch (error) {
    console.error("Code conversion error:", error);
    throw new Error("Failed to convert code");
  }
};

export const optimizeSqlCode = async (
  sqlCode: string,
  sqlType: any
): Promise<string> => {
  try {
    // if(sqlType == "sqlserver"){
    //   sqlType = "SQL SERVER"
    // } else {
    //   sqlType = "Postgres SQL"

    // }
    const response = await axios.post(`${API_URL}`, {
      sql_code: sqlCode,
      sql_type: sqlType,
    });

    return response.data;
  } catch (error) {
    console.error("Optimization error:", error);
    throw new Error("Failed to optimize SQL code");
  }
};
