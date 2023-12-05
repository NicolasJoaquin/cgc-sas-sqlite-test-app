export const insertUsers: string = `
    INSERT INTO users (id, id_api, name, last_name, email, org_chart_position) VALUES 
        (1, 1, "Sebastian", "Diaz", "sebastian_diaz@cgc.com.ar", "Analista de Seguridad, Ambiente y Salud"), 
        (2, 2, "Mariano", "Sosa", "mariano_sosa@cgc.com.ar", "Gerente de Seguridad, Ambiente y Salud"), 
        (3, 3, "Horacio", "Olivera", "horacio_olivera@cgc.com.ar", "Supervisor de Seguridad, Ambiente y Salud");
`;
