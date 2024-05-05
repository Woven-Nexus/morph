export const requestOtp = async () => {
	const url = new URL('/api/login/otp', location.origin);
	const response = await fetch(url);
	response;
};
