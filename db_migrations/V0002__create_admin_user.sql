INSERT INTO t_p10357889_gto_results_portal.users (name, email, password, is_admin) 
VALUES ('Admin', 'admin@gto.dev', 'admin123', true)
ON CONFLICT (email) DO UPDATE SET is_admin = true;