
window.getAvatarUrl = (name, gender) => {
    const seed = encodeURIComponent(name.trim());
    let params = '';
    if (gender === 'M') {
        params = '&top[]=shortHair&top[]=shortFlat&top[]=shaggy&hairColor[]=2c1b18';
    } else if (gender === 'F') {
        params = '&top[]=longHair&top[]=curvy&top[]=straight01&hairColor[]=2c1b18';
    }
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}${params}`;
};
