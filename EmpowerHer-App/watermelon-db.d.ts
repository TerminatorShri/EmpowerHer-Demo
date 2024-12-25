// watermelon-db.d.ts
declare module "@nozbe/watermelondb/adapters/type" {
  export type DatabaseAdapter = {
    dbName: string;
    schema: {
      version: number;
      tables: TableMap;
    };
  };

  export type TableMap = { [key: string]: any }; // Define the type based on your schema
}

declare module "@nozbe/watermelondb/adapters/sqlite" {
  import { DatabaseAdapter } from "@nozbe/watermelondb/adapters/type";

  export class SQLiteAdapter implements DatabaseAdapter {
    dbName: string; // Add this line
    schema: {
      version: number;
      tables: Array<any>; // Replace with actual table type
    }; // Add this line

    constructor(options: {
      dbName: string;
      schema: {
        version: number;
        tables: Array<any>; // Replace with actual table type
      };
    });
  }
}

declare module "@nozbe/watermelondb/Database" {
  import { DatabaseAdapter } from "@nozbe/watermelondb/adapters/type";
  import Model from "@nozbe/watermelondb/Model";

  export default class Database {
    adapter: DatabaseAdapter;
      action: any;
    constructor(options: {
      adapter: DatabaseAdapter;
      modelClasses: Array<typeof Model>;
    });

    get<T extends Model>(tableName: string): any; // Define the return type based on your collections
  }
}

declare module "@nozbe/watermelondb" {
  export interface Column {
    name: string;
    type: string;
    isOptional?: boolean;
    isIndexed?: boolean;
  }

  export type TableSchema = {
    name: string;
    columns: Column[];
  };

  export function tableSchema(schema: TableSchema): TableSchema;
  export function appSchema(schema: {
    version: number;
    tables: Array<TableSchema>;
  }): any; // Define the return type as needed
}
