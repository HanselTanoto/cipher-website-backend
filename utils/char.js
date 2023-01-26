const c = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

module.exports = {
    toNum(ch){
        for(let i=0;i<26;i++){
            if(ch==c[i]){
                return i;
            }
        }
        return -1
    },
    toChr(i){
        return c[i][0];
    }
}