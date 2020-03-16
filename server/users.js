const users = [];

const addUser = ({id, interests}) => {
    console.log('addUser',id)
    interests = interests;

    const existingUser = users.find((user) => user.interests === interests && user.id === id);

    if(existingUser){
        return {error: 'user is exist'};
    }
    const user = {id, interests};
    users.push(user)

    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }

}

const getUser = (id) => {
   return users.find((user) => user.id === id);
} 
    

const getUsersInRoom = (interests) => {
    users.filter((user) => user.interests === interests);
}

module.exports = {addUser, removeUser, getUser, getUsersInRoom};