import { useEffect, useRef, useState } from "react";
import {
  SQLiteDBConnection,
  SQLiteConnection,
  CapacitorSQLite,
} from "@capacitor-community/sqlite";

import { createTables } from './createTables';
/* Test */
// import { createUsersTable } from './createUsersTable';
// import { insertUsers } from './insertUsersTest';
// import { insertInspectionTypes } from './insertInspectionTypesTest';

/* Interfaces y tipos */
import { IExternalUser } from "./interfaces/IExternalUser";
import { IExternalCompany } from "./interfaces/IExternalCompany";

/* Test JSON */
import usersJson from '../sqlite/json/usersTest.json';
import companiesJson from '../sqlite/json/companiesTest.json';

// import fetchedInspections from '../Json/arrayProductos.json';
// import fetchedEmpresas from '../Json/arrayProductos.json';
// import fetchedCuencas from '../Json/arrayProductos.json';
// import fetchedSectores from '../Json/arrayProductos.json';


const useSQLiteDB = () => {
  const db = useRef<SQLiteDBConnection>();
  const sqlite = useRef<SQLiteConnection>();
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    const initializeDB = async () => {
      if (sqlite.current) return;

      sqlite.current = new SQLiteConnection(CapacitorSQLite);
      const ret = await sqlite.current.checkConnectionsConsistency();
      const isConn = (await sqlite.current.isConnection("db_vite", false))
        .result;

      if (ret.result && isConn) {
        db.current = await sqlite.current.retrieveConnection("db_vite", false);
      } else {
        db.current = await sqlite.current.createConnection(
          "db_vite",
          false,
          "no-encryption",
          1,
          false
        );
      }
    };

    initializeDB().then(() => {
      initializeTables(); // Revisar si conviene pasar a promise para esperar a que termine y recién ahí evaluar la ejecución de synchronizeData()
      setInitialized(true);
      /* 
      Criterio de sincronización de datos locales con los que vienen de la API:

      - Si la aplicación está abierta (o en segundo plano), es la hora de hacer el fetch (por ejemplo, 12 del mediodía), 
      y además hay conexión a internet, se hace el fetch.

      - Si la aplicación está cerrada y es la hora de hacer fetch, se notifica al usuario para que, idealmente, abra la aplicación y 
      se dispare el request al backend.
      En caso de no abrir la aplicación o de abrirla y no tener conexión, el fetch no se podrá hacer en el horario estimado, entonces deberá quedar pediente 
      (en una pila de requests a la API, algo así como un historial de actualizaciones) para ejecutarse en cuanto 
        1. Se abra la aplicación
        2. Se tenga conexión a internet
      Si el request queda en la pila sin poder ejecutarse exitosamente y llega la hora siguiente de hacer fetch, se guarda en el historial 
      que el request no salió y se vuelve a intentar todo el proceso pero con el disparo correspondiente al nuevo horario. 
      (por ejemplo: si eran las 12 del mediodía, no se pudo hacer fetch por falta de conexión y llegan las 12 de la noche, el request de las 
        12 del mediodía queda en el historial como 'no-request' y se intenta hacer nuevamente el proceso con el fetch de las 12 de la noche)
      
      ######

      Estados a guardar en la RequestsStack:
      - pending: La hora de hacer el request llegó, pero todavía no se pudo ejecutar porque la aplicación está cerrada o porque no hay conexión.
      
      - successful: La hora de hacer el request llegó, independientemente de si estuvo pendiente o no y cuanto tiempo, el disparo a la API
      se ejecutó con éxito y el backend devolvió una respuesta exitosa. 
      El status code es 200.
      
      - bad-request: Se ejecutó un request a la API pero los datos enviados son incorrectos o falta enviar algún dato obligatorio. 
      El status code es 400.
      
      - unauthorized: Se ejecutó un request a la API pero no hay autorización para llamar al servicio.
      El status code es 401.
      
      - not-found: Se ejecutó un request a la API pero no se encontró el servicio consultado.
      El status code es 404.
      
      - server-error: Se ejecutó un request a la API pero hubo un error en el servidor.
      El status code es 500.

      - no-request: No se pudo ejecutar el request a la API.
      Ej. práctico:
        1. llegaron las 12 del mediodía y el dispositivo tiene la aplicación cerrada
        2. el request de las 12 del mediodía queda en 'pending'
        3. a las 15 hs el usuario abre la aplicación pero no tiene conexión a internet. El request sigue en estado 'pending'
        4. llegan las 12 de la noche y la aplicación está corriendo en segundo plano pero todavía no se tiene conexión
        5. el request de las 12 del mediodía se guarda en la RequestsStack con el estado 'no-request' y con motivo 'no-connection'
        6. se intenta realizar nuevamente el proceso pero con el request de las 12 de la noche
      No hay status code de respuesta.
      Se guarda el motivo por el cual no se pudo ejecutar el request.

      Otros datos a guardar en la RequestsStack: motivos 'no-request'
      - no-connection: no hubo conexión a internet al momento del vencimiento del request. Por ejemplo cuando el request de 
        las 12 del mediodía no se pudo ejecutar por falta de conexión y ya llegaron las 12 de la noche
      - closed-app: la aplicación estaba cerrada al momento del vencimiento del request. Por ejemplo cuando el request de 
        las 12 del mediodía no se pudo ejecutar porque estaba cerrada la aplicación y ya llegaron las 12 de la noche

      Pendientes de definir:
      - Handlers para respuestas erróneas del backend y 'no-request'. Posibilidades:
        1. Notificar al usuario que el request tuvo una respuesta errónea, el motivo y permitir re-lanzar el request de manera manual.
        2. Permitir el uso sin conexión de la aplicación pero con una notificación emergente (tipo toast). 
        Las inspecciones podrían cargarse con datos desactualizados. En cualquier caso se validarán todos los datos del lado del backend 
        a la hora de enviar las inspecciones y si hay algún problema se notifica al usuario a través de la interfaz y la inspección en 
        cuestión queda en estado de borrador para que se pueda modificar y volver a enviar a la API para su carga.
      */
      /* Emulando fetchs a la API que devuelve la info. en formato JSON */
      if(true) { 
        synchronizeData();
      }
    });
  }, []);

  const performSQLAction = async (
    action: (db: SQLiteDBConnection | undefined) => Promise<void>,
    cleanup?: () => Promise<void>
  ) => {
    try {
      await db.current?.open();
      await action(db.current);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      try {
        (await db.current?.isDBOpen())?.result && (await db.current?.close());
        cleanup && (await cleanup());
      } catch {

      }
    }
  };

  // Funciones y promesas
  const getUsers = () => {
    return new Promise((resolve, reject) => {
      const users: Array<IExternalUser> = usersJson;
      console.log('Fetched Users (JSON):', users);
      setTimeout(() => {
        resolve(users);
      }, 250);
    });
  }
  const getCompanies = () => {
    return new Promise((resolve, reject) => {
      const companies: Array<IExternalCompany> = companiesJson;
      console.log('Fetched Companies (JSON):', companies);
      setTimeout(() => {
        resolve(companies);
      }, 250);
    });
  }

  // Faltan agregar loaders
  const synchronizeData = async () => {
    try {
      // Usuarios
      const fetchedUsers: any = await getUsers();
      let fetchedUsersIds: any = [];
      let currentUsersIds: any = [];
      let usersToUpload: any = [];
      let usersToDelete: any = [];
      let usersToUpdate: any = [];

      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const respCurrentUsersIds = await db?.query(`SELECT id_api FROM users WHERE sql_deleted = 0`);
        currentUsersIds = respCurrentUsersIds?.values?.map((v) => v.id_api);
      });
      await fetchedUsers.forEach((fu: any) => {
        fetchedUsersIds.push(fu.id);
        if(!currentUsersIds.includes(fu.id)) usersToUpload.push(fu);
        if(fu.changed) usersToUpdate.push(fu);
      });
      usersToDelete = await currentUsersIds.filter((id: any) => {
        if(!fetchedUsersIds.includes(id)) return id;
      });

      // console.log(usersToUpload);
      // console.log(usersToDelete);
      // console.log(usersToUpdate);

      let usersQueries = "";

      // Query insert de nuevos usuarios
      if(usersToUpload.length > 0) {
        let queryValues: any = [];
        let queryInsert = "INSERT INTO users (id_api, name, last_name, email, org_chart_position) VALUES ";
        await usersToUpload.forEach(async (u: any) => {
          queryValues.push("(" + u.id + ", '" + u.name + "', '" + u.last_name + "', '" + u.email + "', '" +  u.org_chart_position + "')"); 
        });
        queryInsert += queryValues.join(', ');
        queryInsert += ";";
        // console.log('Query Insert (nuevos usuarios)', queryInsert);
        usersQueries += queryInsert;
      }

      // Query delete de usuarios que egresaron
      if(usersToDelete.length > 0) {
        let whereValues: any = usersToDelete.join(' OR id_api = ');
        let queryDelete = "DELETE FROM users WHERE id_api = " + whereValues + ";";
        // console.log('Query Delete (egresos)', queryDelete);
        usersQueries += queryDelete;
      }

      // Queries update de usuarios modificados
      if(usersToUpdate.length > 0) {
        let updateQueries: any = [];
        await usersToUpdate.forEach(async (u: any) => {
          updateQueries.push("UPDATE users SET name = '" + u.name + "', last_name = '" + u.last_name + "', email = '" + u.email + "', org_chart_position = '" + u.org_chart_position + "' WHERE sql_deleted = 0 AND id_api = " + u.id); 
        });
        const updateUsers = updateQueries.join(';') + ";";
        // console.log('Queries Update (actualizaciones)', updateUsers);
        usersQueries += updateUsers;
      }

      // Ejecución de las consultas
      if(usersQueries != "") {
        await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
          await db?.query(usersQueries);
        });
      }
      // End: Usuarios

      // Empresas
      const fetchedCompanies: any = await getCompanies();
      let fetchedCompaniesIds: any = [];
      let currentCompaniesIds: any = [];
      let companiesToUpload: any = [];
      let companiesToDelete: any = [];
      let companiesToUpdate: any = [];

      await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const respCurrentCompaniesIds = await db?.query(`SELECT id_api FROM empresas WHERE sql_deleted = 0`);
        currentCompaniesIds = respCurrentCompaniesIds?.values?.map((v) => v.id_api);
      });
      await fetchedCompanies.forEach((fc: any) => {
        fetchedCompaniesIds.push(fc.company_id);
        if(!currentCompaniesIds.includes(fc.company_id)) companiesToUpload.push(fc);
        if(fc.changed) companiesToUpdate.push(fc);
      });
      companiesToDelete = await currentCompaniesIds.filter((id: any) => {
        if(!fetchedCompaniesIds.includes(id)) return id;
      });

      // console.log(companiesToUpload);
      // console.log(companiesToDelete);
      // console.log(companiesToUpdate);

      let companiesQueries = "";

      // Query insert de nuevas empresas
      if(companiesToUpload.length > 0) {
        let queryValues: any = [];
        let queryInsert = "INSERT INTO empresas (id_api, name) VALUES ";
        await companiesToUpload.forEach(async (c: any) => {
          queryValues.push("(" + c.company_id + ", '" + c.name + "')"); 
        });
        queryInsert += queryValues.join(', ');
        queryInsert += ";";
        // console.log('Query Insert (nuevas empresas)', queryInsert);
        companiesQueries += queryInsert;
      }

      // Query delete de empresas que egresaron
      if(companiesToDelete.length > 0) {
        let whereValues: any = companiesToDelete.join(' OR id_api = ');
        let queryDelete = "DELETE FROM empresas WHERE id_api = " + whereValues + ";";
        // console.log('Query Delete (egresos)', queryDelete);
        companiesQueries += queryDelete;
      }

      // Queries update de usuarios modificados
      if(companiesToUpdate.length > 0) {
        let updateQueries: any = [];
        await companiesToUpdate.forEach(async (c: any) => {
          updateQueries.push("UPDATE empresas SET name = '" + c.name + "' WHERE sql_deleted = 0 AND id_api = " + c.company_id); 
        });
        const updateCompanies = updateQueries.join(';') + ";";
        // console.log('Queries Update (actualizaciones)', updateCompanies);
        companiesQueries += updateCompanies;
      }

      // Ejecución de las consultas
      if(companiesQueries != "") {
        await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
          await db?.query(companiesQueries);
        });
      }


      // Tipos de inspección y sus dependencias

    }
    catch(err) {
      console.log("Error: ", err)
    }
  }

  /**
   * here is where you can check and update table
   * structure
   */
  const initializeTables = async () => {
    performSQLAction(async (db: SQLiteDBConnection | undefined) => {
      // Test manual (drop)
      // const respDeleteAllUsers = await db?.execute("DROP TABLE IF EXISTS users");
      // console.log("delete:", respDeleteAllUsers);

      /* Creación de tablas en general */
      const respCreateTables = await db?.execute(createTables);
      console.log("resp create tables:", respCreateTables);

      // Test manual (delete)
      // const respDeleteAllUsers = await db?.execute("DELETE FROM users");
      // console.log("delete:", respDeleteAllUsers);

    });
  };

  return { performSQLAction, initialized };
};

export default useSQLiteDB;
