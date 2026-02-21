import React from "react";

type AlbumTag = {
    link: string;
    albumTitle: string;
    albumArtist: string;
    tags: string[];
}

const AlbumsTagCloud: React.FC<{ tags: AlbumTag[] }> = ({ tags }) => {
    //count instances of tags
    const tagCounts: Record<string, number> = {};
    tags.forEach(tag => {
        tag.tags.forEach(tagName => {
            tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
        });
    });
    //Sort alphabetically
    const sortedTags = Object.entries(tagCounts)
        .sort()
        .map(([tag, count]) => ({ tag, count }));

    const maxTagSize = 38; // max font size for the most frequent tag
    const minTagSize = 12; // min font size for the least frequent tag

    const getTagSize = (count: number) => {
        const maxCount = Math.max(...sortedTags.map(t => t.count));
        return minTagSize + (count / maxCount) * (maxTagSize - minTagSize);
    };

    const [selectedTag, setSelectedTag] = React.useState<string | null>(null);

  return (
    <>
        <div>
            <h2>Genre Cloud</h2>
            <div className="album-tag-cloud">
                {sortedTags.map((tag, index) => (
                <span key={index} className="album-tag" style={{ fontSize: `${getTagSize(tag.count)}px` }} onClick={() => setSelectedTag(tag.tag)}>
                    {tag.tag}<span style={{ fontSize: `${minTagSize}px` }}> ({tag.count})</span>
                </span>
                ))}
            </div>
        </div>
        <div>
            {selectedTag && (
                <>
                <br />
                <div>
                    <h3>Albums tagged "{selectedTag}"</h3>
                    <ol>
                        {tags.filter(album => album.tags.includes(selectedTag)).map((album, index) => (
                            <li key={index}>
                                <a href={album.link}><i>{album.albumTitle}</i> ({album.albumArtist})</a> - {album.tags.sort().join(', ')}
                            </li>
                        ))}
                    </ol>
                </div>
                </>
            )}
        </div>
    </>
    );
};

export default AlbumsTagCloud;