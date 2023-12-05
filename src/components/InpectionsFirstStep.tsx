import { IonItem, IonLabel, IonInput, IonList, IonSelect, IonSelectOption } from '@ionic/react';

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

interface ContainerProps {
  users: Array<User> | undefined;
  // inspection_types: Array<InspectionType>;
  companies: Array<any> | undefined;
}

const FirstStep: React.FC<ContainerProps> = ({users, companies}) => {
  return (
    <>
      {/* Inhabilitado por ahora - En desarrollo */}
      {/* <IonList>
        <IonItem>
          <IonSelect label="Tipo de inspección" labelPlacement="stacked">
            {
              inspection_types.map((i) => {
                return(
                  <IonSelectOption key={i.id} value={i.id_api}>{i.name}</IonSelectOption>
                )
              })
            }
          </IonSelect>
        </IonItem>
      </IonList> */}

      <IonList>
        <IonItem>
          <IonSelect label="Supervisor" labelPlacement="stacked">
            <IonSelectOption key={0} value={0}>{"--- Seleccione ---"}</IonSelectOption>
            {
              users?.map((u) => {
                return(
                  <IonSelectOption key={u.id} value={u.id_api}>{u.name + " " + u.last_name}</IonSelectOption>
                )
              })
            }
          </IonSelect>
        </IonItem>
      </IonList>

      <IonList>
        <IonItem>
          <IonSelect label="Empresa" labelPlacement="stacked">
            <IonSelectOption key={0} value={0}>{"--- Seleccione ---"}</IonSelectOption>
            {
              companies?.map((c) => {
                return(
                  <IonSelectOption key={c.id} value={c.id_api}>{c.name}</IonSelectOption>
                )
              })
            }
          </IonSelect>
        </IonItem>
      </IonList>
    </>
  );
};

export default FirstStep;
