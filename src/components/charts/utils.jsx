export const renderIcon = (status, IconComponent) => {
  switch (status) {
    case "good":
      return <IconComponent className="text-success-500" size={20} />;
    case "warn":
      return <IconComponent className="text-warning-500" size={20} />;
    case "danger":
      return <IconComponent className="text-danger-500" size={20} />;
    default:
      return <IconComponent className="text-default-500" size={20} />;
  }
};
