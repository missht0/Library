const getLocal = (key) => {
	const value = window.localStorage.getItem(key) || '';
	try {
		return JSON.parse(value);
	} catch (error) {
		return value;
	}
};

const setLocal = (key, value) => {
	window.localStorage.setItem(key, JSON.stringify(value));
};

const removeLocal = (key, isClear = false) => {
	if (isClear) {
		window.localStorage.clear();
		return;
	}
	window.localStorage.removeItem(key);
};

const getSession = (key) => {
	const value = window.sessionStorage.getItem(key) || '';
	try {
		return JSON.parse(value);
	} catch (error) {
		return value;
	}
};

const setSession = (key, value) => {
	window.sessionStorage.setItem(key, JSON.stringify(value));
};

const removeSession = (key, isClear = false) => {
	if (isClear) {
		window.sessionStorage.clear();
		return;
	}
	window.sessionStorage.removeItem(key);
};

export default {
	getLocal,
	setLocal,
	removeLocal,
	getSession,
	setSession,
	removeSession
};
