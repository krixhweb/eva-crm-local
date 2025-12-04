
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/shared/Icon';
import { Composer } from './social/components/Composer';

const SocialComposePage: React.FC = () => {
    const navigate = useNavigate();

    const handlePostCreated = () => {
        // Navigate back to the posts list after successful creation
        navigate('/marketing/channel/social');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-32px)]">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/marketing/channel/social')}
                        className="pl-2 pr-3 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                        <Icon name="arrowLeft" className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compose Post</h1>
                        <p className="text-sm text-gray-500">Create and schedule content for your social channels</p>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Full Height Composer */}
            <div className="flex-1 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                <Composer onPostCreated={handlePostCreated} />
            </div>
        </div>
    );
};

export default SocialComposePage;
