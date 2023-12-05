import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
/* SQLite jeep-sqlite Stencil component definition */
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// import reportWebVitals from './reportWebVitals';
import { defineCustomElements as jeepSqlite, applyPolyfills, JSX as LocalJSX  } from "jeep-sqlite/loader";
import { HTMLAttributes } from 'react';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
// import { JeepSqlite } from "jeep-sqlite/dist/components/jeep-sqlite";

// import { createTables } from './utils/sqlite/createTables';
// import { createUsersTable } from './utils/sqlite/createUsersTable';
// import { insertUsers } from './utils/sqlite/insertUsersTest';

type StencilToReact<T> = {
  [P in keyof T]?: T[P] & Omit<HTMLAttributes<Element>, 'className'> & {
    class?: string;
  };
} ;

declare global {
  export namespace JSX {
    interface IntrinsicElements extends StencilToReact<LocalJSX.IntrinsicElements> {
    }
  }
}

applyPolyfills().then(() => {
  jeepSqlite(window);
});

window.addEventListener('DOMContentLoaded', async () => {
  // console.log('$$$ in index $$$');
  const platform = Capacitor.getPlatform();
  const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite)
  try {
    if(platform === "web") {
      const jeepEl = document.createElement("jeep-sqlite");
      // console.log("Jeep Stencil Component", jeepEl);
      document.body.appendChild(jeepEl);
      await customElements.whenDefined('jeep-sqlite');
      // console.log(`after customElements.whenDefined`);
      await sqlite.initWebStore();
      // console.log(`after initWebStore`);
    }
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection("db_issue9", false)).result;
    var db: SQLiteDBConnection
    if (ret.result && isConn) {
      db = await sqlite.retrieveConnection("db_issue9", false);
    } else {
      db = await sqlite.createConnection("db_issue9", false, "no-encryption", 1, false);
    }

    await db.open();
    /* Queries de ejemplo */
    // let res: any = await db.execute(createUsersTable);
    // console.log(`res create: ${JSON.stringify(res)}`);

    // res = await db.execute(insertUsers);
    // console.log(`res users: ${JSON.stringify(res)}`);

    // let resUsers: any = await db.query("SELECT * FROM users;");
    // console.log("res select", resUsers);

    // res = await db.execute("DELETE FROM users");
    // console.log(`res users delete: ${JSON.stringify(res)}`);

    await db.close();
    await sqlite.closeConnection("db_issue9", false);
    
    const container = document.getElementById('root');
    const root = createRoot(container!);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.log(`Error: ${err}`);
    throw new Error(`Error: ${err}`)
  }
});