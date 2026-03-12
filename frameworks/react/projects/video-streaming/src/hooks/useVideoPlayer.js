function useVideoPlayer() {
    const { currentVideo } = window.useVideo();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);

    React.useEffect(() => {
        if (currentVideo) {
            setDuration(currentVideo.duration);
            setCurrentTime(0);
            setIsPlaying(false);
        }
    }, [currentVideo]);

    const playVideo = () => setIsPlaying(true);
    const pauseVideo = () => setIsPlaying(false);
    const seekTo = (time) => setCurrentTime(time);
    const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

    return {
        currentVideo,
        isPlaying,
        currentTime,
        duration,
        volume,
        isFullscreen,
        playVideo,
        pauseVideo,
        seekTo,
        setVolume,
        toggleFullscreen
    };
}

window.useVideoPlayer = useVideoPlayer;
