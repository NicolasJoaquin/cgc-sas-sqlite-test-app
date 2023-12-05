export const createUsersTable: string = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE NOT NULL,
        name TEXT,
        last_name TEXT,
        email TEXT UNIQUE NOT NULL,
        org_chart_position TEXT,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))   
    );
    CREATE INDEX IF NOT EXISTS users_index_last_modified ON users (last_modified);
    CREATE TRIGGER IF NOT EXISTS users_trigger_last_modified 
    AFTER UPDATE ON users
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE users SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

    PRAGMA user_version = 1;
`;
