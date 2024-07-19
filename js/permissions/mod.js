function canDeletePost(user, post){
    return (user[0].rol === 'admin' || user[0].rol === 'mod') ||
    (post ) ;
}

module.exports = {
    canDeletePost
}