import React from 'react';

const NotFound = () => {
    return (
        <div className="relative w-full z-50 transition-all duration-300 mt-15">
           <div className="container items-center container mx-auto justify-center px-8 lg:px-60 py-10">
            <h1 className="text-5xl mb-5">NOT FOUND</h1>
                <p className="text-gray-500 mt-2">
                    Oops! This page seems to have vanished like my motivation on Monday mornings.
                </p>
                <p className="text-gray-400 text-sm mt-1">
                    Maybe it&apos;s taking a coffee break or got lost in the digital void.
                </p>
            </div>
        </div>
    );
};

export default NotFound;
