import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import FirstStep from '../components/InpectionsFirstStep';
import './Tab2.css';
import React, { useEffect, useState } from "react";

/* SQLite */
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../utils/sqlite/useSQLiteDB";

type User = {
  id: number;
  id_api: number;
  name: string;
  last_name: string;
  email: string;
  org_chart_position: string;
};
// type InspectionType = {
//   id: number;
//   id_api: number;
//   name: string;
//   description: string;
// };

const Tab2: React.FC = () => {

  const [users, setUsers] = useState<Array<User>>();
  // const [inspection_types, setInspectionTypes] = useState<Array<InspectionType>>();
  const [companies, setCompanies] = useState<Array<any>>();

  // Hook para usar la DB SQLite
  const { performSQLAction, initialized } = useSQLiteDB();

  useEffect(() => {
    loadData();
  }, [initialized]);

  const loadData = async () => {
    try {
      // Usuarios
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const respSelect = await db?.query(`SELECT * FROM users`);
        console.log(respSelect);
        setUsers(respSelect?.values);
      });
      // Empresas
      performSQLAction(async (db: SQLiteDBConnection | undefined) => {
        const respSelect = await db?.query(`SELECT * FROM empresas`);
        console.log(respSelect);
        setCompanies(respSelect?.values);
      });
      // Tipos de inspección (inhabilitado por ahora)
      // performSQLAction(async (db: SQLiteDBConnection | undefined) => {
      //   const respSelect = await db?.query(`SELECT * FROM inspection_types`);
      //   // console.log(respSelect);
      //   setInspectionTypes(respSelect?.values);
      // });
    } catch (error) {
      alert((error as Error).message);
      setUsers([]);
      // setInspectionTypes([]);
      setCompanies([]);
    }
  };
  /* Inhabilitado por ahora */
  // const saveDraft = async () => {
  //   try {
  //     const saveDraftQuery = `
  //       INSERT INTO inspections_performed (id, id_api, cuenca_id, yacimiento_id, empresa_id, sector_id, task, location, type_id, observation, manager_id, supervisor_id, fecha_obs, fecha_creacion, sent) VALUES 
  //       (1, 1, "Inspección de permisos de trabajo", "Tooltip"),     
  //     `;
  //     performSQLAction(async (db: SQLiteDBConnection | undefined) => {
  //       const respInsert = await db?.query("");
  //       console.log(respInsert);
  //     });
  //   } catch (error) {
  //     alert((error as Error).message);
  //   }
  // };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Paso 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Paso 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        {
          <FirstStep users={users} companies={companies} />       
        }
        <IonButton expand="block" onClick={loadData}>Set States (Manual)</IonButton>
        {/* <IonButton onClick={saveDraft}>Guardar borrador</IonButton> */}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
