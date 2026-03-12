const { createContext, useContext, useState } = React;

const VideoContext = createContext();

function useVideo() {
    return useContext(VideoContext);
}

// Original 26 videos restored (undoing the removal)
const gameplayVideos = [
    {
        id: 28,
        title: "Ladder Master Speed Run",
        url: "https://www.youtube.com/embed/q-tNtmfwOu0",
        thumbnail: "https://img.youtube.com/vi/q-tNtmfwOu0/maxresdefault.jpg",
        duration: 234,
        quality: "HD",
        views: "65K",
        category: "Puzzle Games",
        description: "Lightning-fast ladder climbing speed run with incredible precision and timing."
    },
    {
        id: 19,
        title: "Sweet Roll ASMR Gameplay",
        url: "https://www.youtube.com/embed/QkIVMT6I2Nw",
        thumbnail: "https://img.youtube.com/vi/QkIVMT6I2Nw/maxresdefault.jpg",
        duration: 567,
        quality: "HD",
        views: "189K",
        category: "Casual Games",
        description: "Relaxing ASMR-style Sweet Roll gameplay perfect for stress relief and satisfaction."
    },
    {
        id: 9,
        title: "Blob Shifter Ultimate Challenge",
        url: "https://www.youtube.com/embed/TM2EBvC6VSc",
        thumbnail: "https://img.youtube.com/vi/TM2EBvC6VSc/maxresdefault.jpg",
        duration: 678,
        quality: "HD",
        views: "98K",
        category: "Puzzle Games",
        description: "Take on the ultimate blob shifter challenge with the hardest levels and obstacles."
    },
    {
        id: 18,
        title: "Sweet Roll Perfect Rolls Collection",
        url: "https://www.youtube.com/embed/oAE5tZR4oX4",
        thumbnail: "https://img.youtube.com/vi/oAE5tZR4oX4/maxresdefault.jpg",
        duration: 289,
        quality: "4K",
        views: "123K",
        category: "Casual Games",
        description: "Collection of perfect sweet rolls with amazing visual effects and combinations."
    },
    {
        id: 8,
        title: "Blob Shifter 3D Color Matching Gameplay",
        url: "https://www.youtube.com/embed/cFA1Hp_JTTs",
        thumbnail: "https://img.youtube.com/vi/cFA1Hp_JTTs/maxresdefault.jpg",
        duration: 423,
        quality: "HD",
        views: "134K",
        category: "Puzzle Games",
        description: "Master the art of color matching in this satisfying blob transformation game."
    },
    {
        id: 25,
        title: "Layer Roll Color Combinations",
        url: "https://www.youtube.com/embed/GrIlEKzGFts",
        thumbnail: "https://img.youtube.com/vi/GrIlEKzGFts/maxresdefault.jpg",
        duration: 289,
        quality: "HD",
        views: "145K",
        category: "Casual Games",
        description: "Beautiful color combinations and patterns in this relaxing layer rolling experience."
    },
    {
        id: 20,
        title: "Battery Run Energy Challenge",
        url: "https://www.youtube.com/embed/kk2rAFI6ns0",
        thumbnail: "https://img.youtube.com/vi/kk2rAFI6ns0/maxresdefault.jpg",
        duration: 423,
        quality: "HD",
        views: "87K",
        category: "Runner Games",
        description: "Charge your way through obstacles in this electrifying battery-powered running game."
    },
    {
        id: 14,
        title: "Hoop Protect Master Gameplay",
        url: "https://www.youtube.com/embed/Y-VU7fWYcxQ",
        thumbnail: "https://img.youtube.com/vi/Y-VU7fWYcxQ/maxresdefault.jpg",
        duration: 387,
        quality: "HD",
        views: "112K",
        category: "Sports Games",
        description: "Master the art of hoop protection with strategic gameplay and perfect timing."
    },
    {
        id: 2,
        title: "Roof Rails New Game Mobile Walkthrough All Levels Update",
        url: "https://www.youtube.com/embed/N34l_ADjUzk",
        thumbnail: "https://img.youtube.com/vi/N34l_ADjUzk/maxresdefault.jpg",
        duration: 890,
        quality: "4K",
        views: "89K",
        category: "Mobile Gaming",
        description: "Latest update gameplay showing all levels and new features in Roof Rails mobile game."
    },
    {
        id: 21,
        title: "Battery Run Power-Up Gameplay",
        url: "https://www.youtube.com/embed/Fwn413MVv54",
        thumbnail: "https://img.youtube.com/vi/Fwn413MVv54/maxresdefault.jpg",
        duration: 356,
        quality: "4K",
        views: "69K",
        category: "Runner Games",
        description: "Collect power-ups and maintain your battery charge in this exciting endless runner."
    },
    {
        id: 7,
        title: "Blob Shifter 3D Amazing Gameplay",
        url: "https://www.youtube.com/embed/uveSgxczYFc",
        thumbnail: "https://img.youtube.com/vi/uveSgxczYFc/maxresdefault.jpg",
        duration: 567,
        quality: "4K",
        views: "156K",
        category: "Puzzle Games",
        description: "Shape-shifting blob adventure with amazing 3D graphics and challenging puzzles."
    },
    {
        id: 26,
        title: "Ladder Master Climbing Challenge",
        url: "https://www.youtube.com/embed/g7XoqQ5zm8w",
        thumbnail: "https://img.youtube.com/vi/g7XoqQ5zm8w/maxresdefault.jpg",
        duration: 456,
        quality: "HD",
        views: "92K",
        category: "Puzzle Games",
        description: "Master the art of ladder climbing with strategic planning and perfect timing."
    },
    {
        id: 10,
        title: "Blob Shifter Perfect Run Gameplay",
        url: "https://www.youtube.com/embed/85m5Y9Vr3MY",
        thumbnail: "https://img.youtube.com/vi/85m5Y9Vr3MY/maxresdefault.jpg",
        duration: 389,
        quality: "HD",
        views: "87K",
        category: "Puzzle Games",
        description: "Watch a perfect run through Blob Shifter with flawless transformations and timing."
    },
    {
        id: 24,
        title: "Layer Roll Perfect Technique",
        url: "https://www.youtube.com/embed/7BhCP2zUBEw",
        thumbnail: "https://img.youtube.com/vi/7BhCP2zUBEw/maxresdefault.jpg",
        duration: 367,
        quality: "4K",
        views: "178K",
        category: "Casual Games",
        description: "Master the perfect layer rolling technique for maximum satisfaction and high scores."
    },
    {
        id: 1,
        title: "Roof Rails New Update Gameplay Walkthrough (iOS,Android) Part 1",
        url: "https://www.youtube.com/embed/uqJl4cDQx5o",
        thumbnail: "https://img.youtube.com/vi/uqJl4cDQx5o/maxresdefault.jpg",
        duration: 720,
        quality: "HD",
        views: "125K",
        category: "Mobile Gaming",
        description: "Complete walkthrough of Roof Rails mobile game featuring levels 1-15 with tips and strategies."
    },
    {
        id: 5,
        title: "Roof Rails Pro Tips and Tricks Gameplay",
        url: "https://www.youtube.com/embed/GwtIOikFByY",
        thumbnail: "https://img.youtube.com/vi/GwtIOikFByY/maxresdefault.jpg",
        duration: 456,
        quality: "HD",
        views: "92K",
        category: "Mobile Gaming",
        description: "Master Roof Rails with these pro tips and advanced strategies for higher scores."
    },
    {
        id: 16,
        title: "Hoop Protect Pro Tips",
        url: "https://www.youtube.com/embed/wbCjRDE-23E",
        thumbnail: "https://img.youtube.com/vi/wbCjRDE-23E/maxresdefault.jpg",
        duration: 234,
        quality: "HD",
        views: "76K",
        category: "Sports Games",
        description: "Professional tips and tricks for mastering Hoop Protect gameplay mechanics."
    },
    {
        id: 11,
        title: "Potato Run Epic Gameplay Adventure",
        url: "https://www.youtube.com/embed/AfKIqDZ7Eys",
        thumbnail: "https://img.youtube.com/vi/AfKIqDZ7Eys/maxresdefault.jpg",
        duration: 445,
        quality: "HD",
        views: "76K",
        category: "Runner Games",
        description: "Join the potato on an epic running adventure through challenging obstacles and power-ups."
    },
    {
        id: 30,
        title: "Gem Stack Color Matching Master",
        url: "https://www.youtube.com/embed/68lA5QeOf0k",
        thumbnail: "https://img.youtube.com/vi/68lA5QeOf0k/maxresdefault.jpg",
        duration: 289,
        quality: "4K",
        views: "98K",
        category: "Puzzle Games",
        description: "Master color matching mechanics in this beautiful gem stacking puzzle game."
    },
    {
        id: 4,
        title: "Roof Rails Level 1-50 Complete Gameplay",
        url: "https://www.youtube.com/embed/6dvm9v9SZA8",
        thumbnail: "https://img.youtube.com/vi/6dvm9v9SZA8/maxresdefault.jpg",
        duration: 1200,
        quality: "HD",
        views: "67K",
        category: "Mobile Gaming",
        description: "Extended gameplay session covering the first 50 levels of Roof Rails with expert techniques."
    },
    {
        id: 12,
        title: "Potato Run Speed Challenge",
        url: "https://www.youtube.com/embed/VnGj8LQyick",
        thumbnail: "https://img.youtube.com/vi/VnGj8LQyick/maxresdefault.jpg",
        duration: 298,
        quality: "4K",
        views: "65K",
        category: "Runner Games",
        description: "High-speed potato running action with incredible reflexes and perfect timing."
    },
    {
        id: 29,
        title: "Gem Stack Jewel Collection",
        url: "https://www.youtube.com/embed/FkBTj95Iq8U",
        thumbnail: "https://img.youtube.com/vi/FkBTj95Iq8U/maxresdefault.jpg",
        duration: 345,
        quality: "HD",
        views: "134K",
        category: "Puzzle Games",
        description: "Collect and stack precious gems in this sparkling puzzle adventure game."
    },
    {
        id: 15,
        title: "Hoop Protect Championship Mode",
        url: "https://www.youtube.com/embed/iPyenC6TcoY",
        thumbnail: "https://img.youtube.com/vi/iPyenC6TcoY/maxresdefault.jpg",
        duration: 456,
        quality: "4K",
        views: "98K",
        category: "Sports Games",
        description: "Championship mode gameplay with advanced strategies and professional techniques."
    },
    {
        id: 6,
        title: "Roof Rails Speed Run Challenge",
        url: "https://www.youtube.com/embed/82Bv6FSxkMc",
        thumbnail: "https://img.youtube.com/vi/82Bv6FSxkMc/maxresdefault.jpg",
        duration: 340,
        quality: "HD",
        views: "78K",
        category: "Mobile Gaming",
        description: "Ultimate speed run challenge in Roof Rails - how fast can you complete 100 levels?"
    },
    {
        id: 17,
        title: "Sweet Roll Satisfying Gameplay",
        url: "https://www.youtube.com/embed/J391DzMhzuA",
        thumbnail: "https://img.youtube.com/vi/J391DzMhzuA/maxresdefault.jpg",
        duration: 345,
        quality: "HD",
        views: "145K",
        category: "Casual Games",
        description: "Incredibly satisfying sweet roll gameplay with smooth animations and relaxing music."
    },
    {
        id: 23,
        title: "Layer Roll Satisfying Peeling",
        url: "https://www.youtube.com/embed/0iLL1gJr2Gg",
        thumbnail: "https://img.youtube.com/vi/0iLL1gJr2Gg/maxresdefault.jpg",
        duration: 445,
        quality: "HD",
        views: "234K",
        category: "Casual Games",
        description: "Incredibly satisfying layer peeling gameplay with smooth animations and ASMR sounds."
    }
];

function VideoProvider({ children }) {
    const [videos] = useState(gameplayVideos);
    const [currentVideo, setCurrentVideo] = useState(gameplayVideos[0]);
    const [favorites, setFavorites] = useState([]);
    const [watchHistory, setWatchHistory] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('All');

    const categories = ['All', 'Mobile Gaming', 'Puzzle Games', 'Runner Games', 'Sports Games', 'Casual Games'];

    const filteredVideos = currentCategory === 'All' 
        ? videos 
        : videos.filter(video => video.category === currentCategory);

    const addToFavorites = (video) => {
        if (!favorites.find(fav => fav.id === video.id)) {
            setFavorites(prev => [...prev, video]);
        }
    };

    const removeFromFavorites = (videoId) => {
        setFavorites(prev => prev.filter(fav => fav.id !== videoId));
    };

    const addToHistory = (video) => {
        setWatchHistory(prev => {
            const filtered = prev.filter(item => item.id !== video.id);
            return [video, ...filtered].slice(0, 20);
        });
    };

    const handleVideoSelect = (video) => {
        setCurrentVideo(video);
        addToHistory(video);
    };

    const shufflePlaylist = () => {
        const shuffled = [...videos].sort(() => Math.random() - 0.5);
        setCurrentVideo(shuffled[0]);
    };

    return React.createElement(VideoContext.Provider, {
        value: {
            videos: filteredVideos,
            allVideos: videos,
            currentVideo,
            setCurrentVideo: handleVideoSelect,
            favorites,
            addToFavorites,
            removeFromFavorites,
            watchHistory,
            categories,
            currentCategory,
            setCurrentCategory,
            shufflePlaylist
        }
    }, children);
}

window.useVideo = useVideo;
window.VideoProvider = VideoProvider;
