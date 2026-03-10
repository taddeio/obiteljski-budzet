import React from "react";
import { Card } from "../../components/ui/Card";

export const BudgetPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Budžet</h1>
        <p className="text-gray-600">
          Upravljajte budžetima za različite kategorije
        </p>
      </div>

      <Card className="bg-gray-50 border-dashed border-2 border-gray-300 p-8">
        <div className="text-center">
          <p className="text-gray-600 font-medium">🎯 Budžeti</p>
          <p className="text-sm text-gray-500 mt-1">
            Funkcionalnost budžeta će biti dostupna uskoro
          </p>
        </div>
      </Card>
    </div>
  );
};
