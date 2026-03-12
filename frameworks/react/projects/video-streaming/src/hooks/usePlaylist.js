function usePlaylist() {
    const { videos, currentVideo, setCurrentVideo } = window.useVideo();

    const playNext = () => {
        const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
        const nextIndex = (currentIndex + 1) % videos.length;
        setCurrentVideo(videos[nextIndex]);
    };

    const playPrevious = () => {
        const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
        const prevIndex = currentIndex === 0 ? videos.length - 1 : currentIndex - 1;
        setCurrentVideo(videos[prevIndex]);
    };

    return {
        playNext,
        playPrevious
    };
}

window.usePlaylist = usePlaylist;
