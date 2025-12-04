
import React from 'react';
import { Icon } from '../../../../components/shared/Icon';
import { Platform, SocialAttachment, LinkMetadata } from '../types';
import { cn } from '../../../../lib/utils';

interface PostPreviewProps {
  platform: Platform;
  text: string;
  attachments: SocialAttachment[];
  linkPreview?: LinkMetadata | null;
}

export const PostPreview: React.FC<PostPreviewProps> = ({ 
  platform, 
  text, 
  attachments, 
  linkPreview
}) => {

  const renderText = (content: string) => {
    if (!content) return <span className="text-gray-400 italic">Start typing to preview...</span>;
    // Highlight hashtags and mentions
    const parts = content.split(/(\s+)/);
    return (
      <div className="whitespace-pre-wrap break-words text-[14px] leading-normal">
        {parts.map((part, i) => 
          part.match(/^[#@]/) ? <span key={i} className="text-blue-500">{part}</span> : part
        )}
      </div>
    );
  };

  const renderMedia = () => {
      if (attachments.length === 0) return null;
      
      // Simple grid for multiple images
      const gridCols = attachments.length === 1 ? 'grid-cols-1' : 'grid-cols-2';
      
      return (
          <div className={`grid ${gridCols} gap-0.5 mt-3 rounded-lg overflow-hidden border border-gray-100 dark:border-zinc-800`}>
              {attachments.slice(0, 4).map((att, i) => (
                  <div key={att.id} className="aspect-square bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
                      {att.type === 'image' ? (
                          <img src={att.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center bg-black text-white">
                              <Icon name="play" className="w-8 h-8" />
                          </div>
                      )}
                      {i === 3 && attachments.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xl">
                              +{attachments.length - 4}
                          </div>
                      )}
                  </div>
              ))}
          </div>
      );
  };

  const renderLink = () => {
      if (!linkPreview || attachments.length > 0) return null;
      if (platform === 'instagram' || platform === 'tiktok') return null; // No link cards

      return (
          <div className="mt-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors">
              {linkPreview.image && (
                  <div className="h-32 w-full bg-gray-200 dark:bg-zinc-800">
                      <img src={linkPreview.image} alt="" className="w-full h-full object-cover" />
                  </div>
              )}
              <div className="p-3">
                  <div className="text-xs text-gray-500 uppercase mb-0.5">{linkPreview.domain}</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{linkPreview.title}</div>
                  <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{linkPreview.description}</div>
              </div>
          </div>
      );
  }

  // --- Platform Templates ---

  if (platform === 'facebook') {
      return (
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-0 shadow-sm max-w-md mx-auto font-sans">
              <div className="p-3 flex items-center gap-2">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 rounded-full" />
                  <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">Eva CRM</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">Just now <Icon name="globe" className="w-3 h-3"/></div>
                  </div>
              </div>
              <div className="px-3 pb-2 text-gray-900 dark:text-gray-100">{renderText(text)}</div>
              <div className="px-0">{renderMedia()}{renderLink()}</div>
              <div className="p-3 border-t border-gray-100 dark:border-zinc-800 flex justify-between text-gray-500">
                   <div className="flex gap-1 items-center text-xs"><Icon name="thumbsUp" className="w-4 h-4"/> Like</div>
                   <div className="flex gap-1 items-center text-xs"><Icon name="messageCircle" className="w-4 h-4"/> Comment</div>
                   <div className="flex gap-1 items-center text-xs"><Icon name="share" className="w-4 h-4"/> Share</div>
              </div>
          </div>
      );
  }

  if (platform === 'x') {
      return (
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm max-w-md mx-auto font-sans">
             <div className="flex gap-3">
                 <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 rounded-full shrink-0" />
                 <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-1 text-[15px]">
                         <span className="font-bold text-gray-900 dark:text-white">Eva CRM</span>
                         <span className="text-gray-500">@evacrm</span>
                         <span className="text-gray-500">· 1m</span>
                     </div>
                     <div className="text-[15px] text-gray-900 dark:text-white mt-0.5">{renderText(text)}</div>
                     {renderMedia()}
                     {renderLink()}
                     <div className="flex justify-between mt-3 text-gray-500 text-xs max-w-[80%]">
                         <Icon name="messageCircle" className="w-4 h-4"/>
                         <Icon name="refreshCw" className="w-4 h-4"/>
                         <Icon name="heart" className="w-4 h-4"/>
                         <Icon name="activity" className="w-4 h-4"/>
                     </div>
                 </div>
             </div>
        </div>
      );
  }

  if (platform === 'instagram') {
      return (
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm max-w-sm mx-auto font-sans overflow-hidden">
               <div className="p-3 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                       <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px] rounded-full">
                           <div className="w-full h-full bg-white dark:bg-black rounded-full border-2 border-transparent" />
                       </div>
                       <span className="text-sm font-semibold text-gray-900 dark:text-white">evacrm</span>
                   </div>
                   <Icon name="moreVertical" className="w-4 h-4 text-gray-900 dark:text-white" />
               </div>
               {attachments.length > 0 ? renderMedia() : <div className="aspect-square bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-gray-400 text-xs">No Media Selected</div>}
               <div className="p-3">
                   <div className="flex gap-4 mb-2 text-gray-900 dark:text-white">
                       <Icon name="heart" className="w-6 h-6" />
                       <Icon name="messageCircle" className="w-6 h-6" />
                       <Icon name="send" className="w-6 h-6" />
                       <div className="flex-1" />
                       <Icon name="bookmark" className="w-6 h-6" />
                   </div>
                   <div className="text-sm text-gray-900 dark:text-white">
                       <span className="font-semibold mr-2">evacrm</span>
                       {renderText(text)}
                   </div>
               </div>
          </div>
      );
  }

  if (platform === 'linkedin') {
      return (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-0 shadow-sm max-w-md mx-auto font-sans">
               <div className="p-3 flex gap-2">
                   <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-800 rounded" />
                   <div>
                       <div className="text-sm font-bold text-gray-900 dark:text-white">Eva CRM</div>
                       <div className="text-xs text-gray-500">15,234 followers</div>
                       <div className="text-xs text-gray-500">1m • <Icon name="globe" className="w-3 h-3 inline"/></div>
                   </div>
               </div>
               <div className="px-3 pb-2 text-sm text-gray-900 dark:text-white">{renderText(text)}</div>
               <div className="px-0">{renderMedia()}{renderLink()}</div>
               <div className="px-4 py-2 border-t border-gray-100 dark:border-zinc-800 flex justify-between">
                   {['Like', 'Comment', 'Repost', 'Send'].map(action => (
                       <div key={action} className="flex flex-col items-center gap-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 p-2 rounded cursor-pointer">
                            <Icon name={action === 'Like' ? 'thumbsUp' : action === 'Comment' ? 'messageSquare' : action === 'Repost' ? 'refreshCw' : 'send' as any} className="w-5 h-5" />
                            <span className="text-xs font-medium">{action}</span>
                       </div>
                   ))}
               </div>
          </div>
      );
  }

  return <div className="p-4 text-center text-gray-500">Select a platform to preview</div>;
};
