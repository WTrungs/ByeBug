export const getUser = () => {
    const user = localStorage.getItem('USER')|| localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const isAdmin = () => {
    const user = getUser();
    return user?.role === 'ADMIN';
};