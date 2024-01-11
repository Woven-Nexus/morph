let uniqueId = 0;


/** Resets the unique id counter. */
export const resetUniqueId = (): void => {
	uniqueId = 0;
};


/** Returns a unique integer id. */
export const generateUniqueId = (): number => {
	return uniqueId++;
};
