"use client";

const NotificationBadge = ({ count }) => {
  if (count === 0) return null;

  return (
    <div className="relative">
      <span
        className={`
          absolute -top-1 -right-1 
          min-w-[20px] h-5 
          bg-red-500 text-white 
          text-xs font-bold 
          rounded-full 
          flex items-center justify-center
          animate-pulse
        `}
      >
        {count > 99 ? "99+" : count}
      </span>
    </div>
  );
};

export default NotificationBadge;
