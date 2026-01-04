import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

// Add type definition for webkitAudioContext
interface WindowWithWebkitAudioContext extends Window {
    webkitAudioContext?: typeof AudioContext;
}

const MusicPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [colorHue, setColorHue] = useState(200);
    const [hasSeekd, setHasSeeked] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(() => {
        if (typeof window !== 'undefined') {
            const completed = localStorage.getItem('musicCompleted') === 'true';
            return completed ? '/music/24.2.mp3' : '/music/24.mp3';
        }
        return '/music/24.mp3';
    });
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                // Initialize Web Audio API on first play
                if (!audioContextRef.current && audioRef.current) {
                    const AudioContextClass = window.AudioContext || (window as unknown as WindowWithWebkitAudioContext).webkitAudioContext;
                    if (AudioContextClass) {
                        const audioContext = new AudioContextClass();
                        const analyser = audioContext.createAnalyser();
                        const source = audioContext.createMediaElementSource(audioRef.current);

                        analyser.fftSize = 256;
                        source.connect(analyser);
                        analyser.connect(audioContext.destination);

                        audioContextRef.current = audioContext;
                        analyserRef.current = analyser;
                    }
                }
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (time: number): string => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const updateProgress = (clientX: number) => {
        if (!audioRef.current || !progressRef.current) return;

        const rect = progressRef.current.getBoundingClientRect();
        const clickX = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = percentage * duration;

        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        setHasSeeked(true); // Mark that user has seeked
    };

    const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        updateProgress(e.clientX);
    };

    // Memoize event handlers for useEffect dependency
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) {
            updateProgress(e.clientX);
        }
    }, [isDragging, duration]); // Added duration dependency as updateProgress uses it

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Analyze audio and update colors
    const analyzeAudio = useCallback(() => {
        if (!analyserRef.current || !isPlaying) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average frequency
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

        // Map frequency to hue (0-360)
        const hue = Math.floor((average / 255) * 360);
        setColorHue(hue);

        animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    }, [isPlaying]);

    useEffect(() => {
        if (isPlaying) {
            analyzeAudio();
        } else {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPlaying, analyzeAudio]);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            // If current track is the first one, switch to the second one
            const alreadyCompleted = localStorage.getItem('musicCompleted') === 'true';
            if (currentTrack === '/music/24.mp3' && !hasSeekd && !alreadyCompleted) {

                setCurrentTrack('/music/24.2.mp3');

                // Need to wait for state update and new source to load
                setTimeout(() => {
                    if (audioRef.current) {
                        audioRef.current.play().then(() => {
                            setIsPlaying(true);
                            localStorage.setItem('musicCompleted', 'true');
                            setCurrentTrack('/music/24.2.mp3');
                            window.dispatchEvent(new Event('musicCompleted'));
                        }).catch(e => console.error("Auto-play failed:", e));
                    }
                }, 100);
            } else {
                setIsPlaying(false);
            }
        };

        const handlePlay = () => {
            // Reset seek flag when music starts playing
            setHasSeeked(false);
        };

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);

        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [hasSeekd, currentTrack]);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div
            className="w-full max-w-sm mx-auto px-4 py-3 rounded-lg border transition-all duration-300 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        >
            <audio ref={audioRef} src={currentTrack} preload="metadata" crossOrigin="anonymous" />

            <div className="flex items-center gap-3 mb-2">
                <button
                    onClick={togglePlay}
                    className="flex items-center justify-center w-9 h-9 rounded-full text-white transition-all duration-200 focus:outline-none focus:ring-2 flex-shrink-0 bg-gray-700 dark:bg-gray-600"
                    style={isPlaying ? {
                        backgroundColor: `hsl(${colorHue}, 70%, 50%)`,
                        boxShadow: `0 0 20px hsla(${colorHue}, 70%, 50%, 0.4)`,
                    } : undefined}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? (
                        <FaPause className="text-xs" />
                    ) : (
                        <FaPlay className="text-xs ml-0.5" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="text-gray-800 dark:text-gray-200 font-medium text-xs truncate">
                        {currentTrack === '/music/24.mp3' ? 'Chopin - Nocturne Op. 48 No. 1' : 'Mr. Robot - 1.0_8-whatsyourask.m4p'}
                    </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 font-mono flex-shrink-0">
                    <span className="font-medium">{formatTime(currentTime)}</span>
                    <span className="text-gray-400">/</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div
                ref={progressRef}
                onMouseDown={handleProgressMouseDown}
                className="relative w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer overflow-hidden group"
            >
                <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-100 bg-gray-600 dark:bg-gray-500"
                    style={isPlaying ? {
                        width: `${progress}%`,
                        backgroundColor: `hsl(${colorHue}, 70%, 50%)`,
                    } : { width: `${progress}%` }}
                />
                <div
                    className="absolute top-0 left-0 h-full rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-700 dark:bg-gray-400"
                    style={isPlaying ? {
                        width: `${progress}%`,
                        backgroundColor: `hsl(${colorHue}, 80%, 40%)`,
                    } : { width: `${progress}%` }}
                />
                {/* Draggable handle */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md bg-gray-700 dark:bg-gray-400"
                    style={isPlaying ? {
                        left: `calc(${progress}% - 6px)`,
                        backgroundColor: `hsl(${colorHue}, 70%, 50%)`,
                    } : { left: `calc(${progress}% - 6px)` }}
                />
            </div>
        </div>
    );
};

export default MusicPlayer;
