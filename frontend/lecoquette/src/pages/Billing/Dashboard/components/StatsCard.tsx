import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";

type Props = {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: React.ReactNode;
};

export const StatsCard = ({ title, value, icon, description }: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm text-gray-600">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl text-gray-900">{value}</div>
        {description}
      </CardContent>
    </Card>
  );
};