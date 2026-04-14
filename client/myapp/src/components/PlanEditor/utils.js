export const getPlanTypeColor = (type) => {
  const colors = {
    leisure: "#3b82f6",
    adventure: "#f97316",
    family: "#8b5cf6",
    solo: "#06b6d4",
    romantic: "#ec4899",
    business: "#64748b",
  };
  return colors[type] || colors.leisure;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
