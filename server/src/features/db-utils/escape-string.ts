export const escapeSQLiteString = (str: string) => {
	return str.replaceAll("'", "''");
};
