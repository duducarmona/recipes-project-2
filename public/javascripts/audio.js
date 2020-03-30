function playAddFavoriteAudio() {
  const favoriteAudio = new Audio('../audio/state-change_confirm-up.ogg');
  favoriteAudio.play();
}

function playRemoveFavoriteAudio() {
  const favoriteAudio = new Audio('../audio/state-change_confirm-down.ogg');
  favoriteAudio.play();
}
