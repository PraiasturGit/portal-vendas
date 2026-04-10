import { useState, useEffect, useCallback } from "react";
import api from "@/service/api";
import { useAuth } from "@/context/AuthContext";

type AnalyticsTab = "vendas" | "convites" | "vendas-convites";

interface FiltrosState {
  mes: number;
  ano: number;
  tipo_venda: string;
  id_vendedor: string;
  data_inicial?: string;
  data_final?: string;
}

export function useAnalytics() {
  const { user } = useAuth();

  // Estados de Dados
  const [metricas, setMetricas] = useState<any>(null);
  const [historicoVendas, setHistoricoVendas] = useState<any[]>([]);
  const [listaVendedores, setListaVendedores] = useState<any[]>([]);
  const [supervisores, setSupervisores] = useState<any[]>([]);

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("vendas");

  // Filtros
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [filtros, setFiltros] = useState<FiltrosState>({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    tipo_venda: "TODOS",
    id_vendedor: "TODOS",
  });

  const carregarListaVendedores = useCallback(async (supId?: string) => {
    try {
      const params = { params: { supervisor_id: supId } };
      const res = await api.get("/api/dashboard/vendedores-lista", params);
      setListaVendedores(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Erro ao buscar vendedores", error);
      setListaVendedores([]);
    }
  }, []);

  const carregarSupervisores = useCallback(async () => {
    try {
      const res = await api.get("/api/dashboard/supervisores");
      setSupervisores(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Erro supervisores", error);
      setSupervisores([]);
    }
  }, []);

  const carregarDados = useCallback(async () => {
    setLoading(true);
    try {
      const supId =
        selectedSupervisor ||
        (user?.role === "SUPERVISOR" ? String(user.id) : undefined);

      const requestParams: any = {
        supervisor_id: supId,
        mes: filtros.mes,
        ano: filtros.ano,
        tipo_venda: filtros.tipo_venda,
        id_vendedor_filtro: filtros.id_vendedor,
      };

      if (filtros.data_inicial) {
        requestParams.data_inicial = filtros.data_inicial;
      }

      if (filtros.data_final) {
        requestParams.data_final = filtros.data_final;
      }

      console.log("🔍 [FRONT] Enviando params:", requestParams);

      const [resMetricas, resHist] = await Promise.all([
        api.get("/api/dashboard/metricas", { params: requestParams }),
        api.get("/api/dashboard/vendas", { params: requestParams }),
      ]);

      setMetricas(resMetricas.data || null);
      setHistoricoVendas(Array.isArray(resHist.data) ? resHist.data : []);
    } catch (error) {
      console.error("Erro dashboard", error);
      setMetricas(null);
      setHistoricoVendas([]);
    } finally {
      setLoading(false);
    }
  }, [filtros, selectedSupervisor, user]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      carregarSupervisores();
    } else if (user) {
      carregarListaVendedores();
    }
  }, [user, carregarSupervisores, carregarListaVendedores]);

  useEffect(() => {
    if (selectedSupervisor) {
      carregarListaVendedores(selectedSupervisor);
      setFiltros((prev) => ({ ...prev, id_vendedor: "TODOS" }));
    }
  }, [selectedSupervisor, carregarListaVendedores]);

  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [carregarDados, user]);

  return {
    user,
    metricas,
    historicoVendas,
    listaVendedores,
    supervisores,
    loading,
    activeTab,
    setActiveTab,
    filtros,
    setFiltros,
    selectedSupervisor,
    setSelectedSupervisor,
  };
}
