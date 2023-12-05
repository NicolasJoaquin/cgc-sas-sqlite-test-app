export const createTables: string = `
    CREATE TABLE IF NOT EXISTS main_user (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE NOT NULL,
        name TEXT,
        last_name TEXT,
        email TEXT UNIQUE NOT NULL,
        permissions TEXT,
        org_chart_position TEXT,
        token TEXT,
        token_expiration_date TEXT,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))   
    );
    CREATE INDEX IF NOT EXISTS main_user_index_last_modified ON main_user (last_modified);
    CREATE TRIGGER IF NOT EXISTS main_user_trigger_last_modified 
    AFTER UPDATE ON main_user
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE main_user SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

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

    CREATE TABLE IF NOT EXISTS empresas (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE NOT NULL,
        name TEXT,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))   
    );
    CREATE INDEX IF NOT EXISTS empresas_index_last_modified ON empresas (last_modified);
    CREATE TRIGGER IF NOT EXISTS empresas_trigger_last_modified 
    AFTER UPDATE ON empresas
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE empresas SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

    CREATE TABLE IF NOT EXISTS cuencas (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE NOT NULL,
        name TEXT,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))   
    );
    CREATE INDEX IF NOT EXISTS cuencas_index_last_modified ON cuencas (last_modified);
    CREATE TRIGGER IF NOT EXISTS cuencas_trigger_last_modified 
    AFTER UPDATE ON cuencas
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE cuencas SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

    CREATE TABLE IF NOT EXISTS yacimientos (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE NOT NULL,
        name TEXT,
        cuenca_id INTEGER NOT NULL,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
        FOREIGN KEY (cuenca_id) REFERENCES cuencas(id_api) ON DELETE SET DEFAULT
    );
    CREATE INDEX IF NOT EXISTS yacimientos_index_last_modified ON yacimientos (last_modified);
    CREATE TRIGGER IF NOT EXISTS yacimientos_trigger_last_modified 
    AFTER UPDATE ON yacimientos
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE yacimientos SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

    CREATE TABLE IF NOT EXISTS sectores (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE NOT NULL,
        name TEXT,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))   
    );
    CREATE INDEX IF NOT EXISTS sectores_index_last_modified ON sectores (last_modified);
    CREATE TRIGGER IF NOT EXISTS sectores_trigger_last_modified 
    AFTER UPDATE ON sectores
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE sectores SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

    CREATE TABLE IF NOT EXISTS inspection_types (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))   
    );
    CREATE INDEX IF NOT EXISTS inspection_types_index_last_modified ON inspection_types (last_modified);
    CREATE TRIGGER IF NOT EXISTS inspection_types_trigger_last_modified 
    AFTER UPDATE ON inspection_types
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE inspection_types SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

    CREATE TABLE IF NOT EXISTS additional_fields (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))   
    );
    CREATE INDEX IF NOT EXISTS additional_fields_index_last_modified ON additional_fields (last_modified);
    CREATE TRIGGER IF NOT EXISTS additional_fields_trigger_last_modified 
    AFTER UPDATE ON additional_fields
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE additional_fields SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

    CREATE TABLE IF NOT EXISTS additional_fields_by_inspection_type (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE,
        additional_field_id INTEGER NOT NULL,
        inspection_type_id INTEGER NOT NULL,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
        FOREIGN KEY (additional_field_id) REFERENCES additional_fields(id_api) ON DELETE SET DEFAULT,
        FOREIGN KEY (inspection_type_id) REFERENCES inspection_types(id_api) ON DELETE SET DEFAULT
    );
    CREATE INDEX IF NOT EXISTS additional_fields_by_inspection_type_index_last_modified ON additional_fields_by_inspection_type (last_modified);
    CREATE TRIGGER IF NOT EXISTS additional_fields_by_inspection_type_trigger_last_modified 
    AFTER UPDATE ON additional_fields_by_inspection_type
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE additional_fields_by_inspection_type SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

    CREATE TABLE IF NOT EXISTS question_categories (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE NOT NULL,
        letter TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))   
    );
    CREATE INDEX IF NOT EXISTS question_categories_index_last_modified ON question_categories (last_modified);
    CREATE TRIGGER IF NOT EXISTS question_categories_trigger_last_modified 
    AFTER UPDATE ON question_categories
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE question_categories SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

    CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE NOT NULL,
        category_id INTEGER NOT NULL,
        number INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        management_required INTEGER DEFAULT 0,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
        FOREIGN KEY (category_id) REFERENCES question_categories(id_api) ON DELETE SET DEFAULT
    );
    CREATE INDEX IF NOT EXISTS questions_index_last_modified ON questions (last_modified);
    CREATE TRIGGER IF NOT EXISTS questions_trigger_last_modified 
    AFTER UPDATE ON questions
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE questions SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

    CREATE TABLE IF NOT EXISTS questions_by_inspection_type (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE,
        question_id INTEGER NOT NULL,
        inspection_type_id INTEGER NOT NULL,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
        FOREIGN KEY (question_id) REFERENCES questions(id_api) ON DELETE SET DEFAULT,
        FOREIGN KEY (inspection_type_id) REFERENCES inspection_types(id_api) ON DELETE SET DEFAULT
    );
    CREATE INDEX IF NOT EXISTS questions_by_inspection_type_index_last_modified ON questions_by_inspection_type (last_modified);
    CREATE TRIGGER IF NOT EXISTS questions_by_inspection_type_trigger_last_modified 
    AFTER UPDATE ON questions_by_inspection_type
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE questions_by_inspection_type SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

    CREATE TABLE IF NOT EXISTS inspections_performed (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE,
        cuenca_id INTEGER NOT NULL,
        yacimiento_id INTEGER NOT NULL,
        empresa_id INTEGER NOT NULL,
        sector_id INTEGER NOT NULL,
        task TEXT NOT NULL,
        location TEXT NOT NULL,
        type_id INTEGER NOT NULL,
        observation TEXT,
        manager_id INTEGER NOT NULL,
        supervisor_id INTEGER NOT NULL,
        fecha_obs TEXT NOT NULL,
        fecha_creacion TEXT NOT NULL,
        sent INTEGER NOT NULL DEFAULT 0,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
        FOREIGN KEY (cuenca_id) REFERENCES cuencas(id_api) ON DELETE SET DEFAULT,
        FOREIGN KEY (yacimiento_id) REFERENCES yacimientos(id_api) ON DELETE SET DEFAULT,
        FOREIGN KEY (empresa_id) REFERENCES empresas(id_api) ON DELETE SET DEFAULT,
        FOREIGN KEY (sector_id) REFERENCES sectores(id_api) ON DELETE SET DEFAULT,
        FOREIGN KEY (type_id) REFERENCES inspection_types(id_api) ON DELETE SET DEFAULT,
        FOREIGN KEY (manager_id) REFERENCES users(id_api) ON DELETE SET DEFAULT,
        FOREIGN KEY (supervisor_id) REFERENCES users(id_api) ON DELETE SET DEFAULT
    );
    CREATE INDEX IF NOT EXISTS inspections_performed_index_last_modified ON inspections_performed (last_modified);
    CREATE TRIGGER IF NOT EXISTS inspections_performed_trigger_last_modified 
    AFTER UPDATE ON inspections_performed
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE inspections_performed SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

    CREATE TABLE IF NOT EXISTS additional_fields_performed (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE,
        additional_field_id INTEGER NOT NULL,
        inspection_performed_id INTEGER NOT NULL,
        text_value TEXT NOT NULL,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
        FOREIGN KEY (additional_field_id) REFERENCES additional_fields(id_api) ON DELETE SET DEFAULT,
        FOREIGN KEY (inspection_performed_id) REFERENCES inspections_performed(id) ON DELETE SET DEFAULT
    );
    CREATE INDEX IF NOT EXISTS additional_fields_performed_index_last_modified ON additional_fields_performed (last_modified);
    CREATE TRIGGER IF NOT EXISTS additional_fields_performed_trigger_last_modified 
    AFTER UPDATE ON additional_fields_performed
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE additional_fields_performed SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

    CREATE TABLE IF NOT EXISTS answered_questions (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE,
        question_id INTEGER NOT NULL,
        inspection_performed_id INTEGER NOT NULL,
        response INTEGER NOT NULL,
        observation TEXT DEFAULT NULL,
        management_required INTEGER DEFAULT 0,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
        FOREIGN KEY (question_id) REFERENCES questions(id_api) ON DELETE SET DEFAULT,
        FOREIGN KEY (inspection_performed_id) REFERENCES inspections_performed(id) ON DELETE SET DEFAULT
    );
    CREATE INDEX IF NOT EXISTS answered_questions_index_last_modified ON answered_questions (last_modified);
    CREATE TRIGGER IF NOT EXISTS answered_questions_trigger_last_modified 
    AFTER UPDATE ON answered_questions
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE answered_questions SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;
    
    CREATE TABLE IF NOT EXISTS action_types (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT DEFAULT NULL,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))
    );
    CREATE INDEX IF NOT EXISTS action_types_index_last_modified ON action_types (last_modified);
    CREATE TRIGGER IF NOT EXISTS action_types_trigger_last_modified 
    AFTER UPDATE ON action_types
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE action_types SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

    CREATE TABLE IF NOT EXISTS actions_performed (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE,
        manager_id INTEGER NOT NULL,
        action_type_id INTEGER NOT NULL,
        state INTEGER NOT NULL DEFAULT 0,
        estimated_date TEXT NOT NULL,
        effective_date TEXT DEFAULT NULL,
        observation_performing TEXT DEFAULT NULL,
        performer_user_id INTEGER DEFAULT NULL,
        observation TEXT NOT NULL,
        register_id INTEGER DEFAULT NULL,
        registers_ids TEXT DEFAULT NULL,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
        FOREIGN KEY (manager_id) REFERENCES users(id_api) ON DELETE SET DEFAULT,
        FOREIGN KEY (action_type_id) REFERENCES action_types(id) ON DELETE SET DEFAULT,
        FOREIGN KEY (performer_user_id) REFERENCES users(id_api) ON DELETE SET DEFAULT
    );
    CREATE INDEX IF NOT EXISTS actions_performed_index_last_modified ON actions_performed (last_modified);
    CREATE TRIGGER IF NOT EXISTS actions_performed_trigger_last_modified 
    AFTER UPDATE ON actions_performed
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE actions_performed SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

    CREATE TABLE IF NOT EXISTS internal_participants (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE,
        user_id INTEGER NOT NULL,
        inspection_performed_id INTEGER NOT NULL,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
        FOREIGN KEY (user_id) REFERENCES users(id_api) ON DELETE SET DEFAULT,
        FOREIGN KEY (inspection_performed_id) REFERENCES inspections_performed(id) ON DELETE SET DEFAULT
    );
    CREATE INDEX IF NOT EXISTS internal_participants_index_last_modified ON internal_participants (last_modified);
    CREATE TRIGGER IF NOT EXISTS internal_participants_trigger_last_modified 
    AFTER UPDATE ON internal_participants
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE internal_participants SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;

    CREATE TABLE IF NOT EXISTS external_participants (
        id INTEGER PRIMARY KEY NOT NULL,
        id_api INTEGER UNIQUE,
        inspection_performed_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        dni TEXT DEFAULT NULL,
        last_modified INTEGER DEFAULT (strftime('%s', 'now')),
        sql_deleted BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1)),
        FOREIGN KEY (inspection_performed_id) REFERENCES inspections_performed(id) ON DELETE SET DEFAULT
    );
    CREATE INDEX IF NOT EXISTS external_participants_index_last_modified ON external_participants (last_modified);
    CREATE TRIGGER IF NOT EXISTS external_participants_trigger_last_modified 
    AFTER UPDATE ON external_participants
    FOR EACH ROW WHEN NEW.last_modified <= OLD.last_modified  
    BEGIN  
        UPDATE external_participants SET last_modified= (strftime('%s', 'now')) WHERE id=OLD.id;   
    END;
        
    -- inspection_attachments
    -- question_attachments

    PRAGMA user_version = 1;
    PRAGMA foreign_keys = ON;
`;
