import React from 'react';
import Avatar from 'react-avatar';

const Client = ({ username }) => {
  // Use DiceBear with 'micah' style for sketch avatars
  const imageUrl = `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(username)}`;

  return (
    <div className="client" title={username}>
      <Avatar
        src={imageUrl}         
        name={username}
        size="50"
        round={true}
        textSizeRatio={2}
      />
      <span className="userName">{username}</span>
    </div>
  );
};

export default Client;
