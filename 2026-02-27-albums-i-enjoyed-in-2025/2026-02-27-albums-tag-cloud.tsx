/**
 * Component to display a tag cloud of album tags. Clicking on a tag will show a list of albums that have that tag.
 * The size of the tag is determined by how many albums have that tag.
 * 
 * Expects a list of AlbumTag objects, see below.
 */

import React from "react";
import "./2026-02-27-albums-tag-cloud.css";

/**
 * 
 * link: string - link to the album (can be relative link to jump on the page)
 * albumTitle: string - title of the album
 * albumArtist: string - artist of the album
 * tags: string[] - list of tags associated with the album
 */
type AlbumTag = {
    link: string;
    albumTitle: string;
    albumArtist: string;
    tags: string[];
}

/**
 * tags: list of AlbumTag objects
 * maxTagSize: maximum font size for the most common tag (default: 38px)
 * minTagSize: minimum font size for the least common tag (default: 12px)
 */
type AlbumsTagCloudProps = {
    tags: AlbumTag[];
    maxTagSize?: number;
    minTagSize?: number;
}

const AlbumsTagCloud: React.FC<AlbumsTagCloudProps> = ({ tags, maxTagSize = 38, minTagSize = 12 }) => {

    //count instances of tags
    const tagCounts: Record<string, number> = {};
    tags.forEach(tag => {
        tag.tags.forEach(tagName => {
            tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
        });
    });

    //Sort alphabetically
    const sortedTagsWithCounts = Object.entries(tagCounts)
        .sort()
        .map(([tag, count]) => ({ tag, count })); //Attach counts

    const maxCount = Math.max(...sortedTagsWithCounts.map(t => t.count));

    /*
     *  Calculate the font size for a tag based on its count.
     *  The most common tag will have the maxTagSize, and the least common tag will have the minTagSize.
     *  The size is calculated linearly based on the count relative to the maximum count.
     */
    const getTagSize = (count: number) => {
        return minTagSize + (count / maxCount) * (maxTagSize - minTagSize);
    };

    const [selectedTag, setSelectedTag] = React.useState<string | null>(null);

    // Tag cloud on top, and a list of albums that have the selected tag below (when a tag is clicked)
    return (
        <>
            <div className="album-tag-cloud">
                {sortedTagsWithCounts.map((tag, index) => (
                    <span key={index} className="album-tag" style={{ fontSize: `${getTagSize(tag.count)}px` }} onClick={() => setSelectedTag(tag.tag)}>
                        {tag.tag}<span style={{ fontSize: `${minTagSize}px` }}> ({tag.count})</span>
                    </span>
                ))}
            </div>
            {selectedTag && (
                <>
                    <br /> <br />
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
        </>
    );
};

export default AlbumsTagCloud;