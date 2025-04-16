
import { Card, CardContent } from "./components/ui/card";
import { useState, useEffect } from "react";
import { format, isBefore } from "date-fns";

export default function AssinaturasDashboard() {
  const [clientes, setClientes] = useState([
    {
      nome: "João Silva",
      telefone: "(11) 99999-9999",
      inicio: "2024-04-01",
      vencimento: "2025-04-10",
      planoMensal: 49.9,
      planoAnual: 499.0,
    },
    {
      nome: "Maria Oliveira",
      telefone: "(21) 98888-8888",
      inicio: "2024-03-15",
      vencimento: "2025-03-15",
      planoMensal: 59.9,
      planoAnual: 579.0,
    },
    {
      nome: "Carlos Pereira",
      telefone: "(31) 97777-7777",
      inicio: "2024-02-01",
      vencimento: "2024-04-01",
      planoMensal: 39.9,
      planoAnual: 399.0,
    },
  ]);

  const [ativos, setAtivos] = useState(0);
  const [atrasados, setAtrasados] = useState(0);
  const [filtro, setFiltro] = useState("todos");
  const [novoCliente, setNovoCliente] = useState({
    nome: "",
    telefone: "",
    inicio: "",
    vencimento: "",
    planoMensal: "",
    planoAnual: "",
  });

  useEffect(() => {
    const hoje = new Date();
    const ativosTemp = clientes.filter(
      (c) => !isBefore(new Date(c.vencimento), hoje)
    ).length;
    const atrasadosTemp = clientes.length - ativosTemp;
    setAtivos(ativosTemp);
    setAtrasados(atrasadosTemp);
  }, [clientes]);

  const adicionarCliente = () => {
    setClientes([
      ...clientes,
      {
        ...novoCliente,
        planoMensal: parseFloat(novoCliente.planoMensal),
        planoAnual: parseFloat(novoCliente.planoAnual),
      },
    ]);
    setNovoCliente({
      nome: "",
      telefone: "",
      inicio: "",
      vencimento: "",
      planoMensal: "",
      planoAnual: "",
    });
  };

  const exportarCSV = () => {
    const header = "Nome,Telefone,Início,Vencimento,Plano Mensal,Plano Anual
";
    const rows = clientes
      .map(
        (c) =>
          `${c.nome},${c.telefone},${c.inicio},${c.vencimento},${c.planoMensal},${c.planoAnual}`
      )
      .join("
");
    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "relatorio_clientes.csv");
    link.click();
  };

  const hoje = new Date();
  const clientesFiltrados = clientes.filter((cliente) => {
    const vencido = isBefore(new Date(cliente.vencimento), hoje);
    if (filtro === "ativos") return !vencido;
    if (filtro === "atrasados") return vencido;
    return true;
  });

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-2xl font-bold">📋 Controle de Assinaturas</h1>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-green-100">
          <CardContent className="p-4">
            <p className="text-lg font-semibold">✅ Assinantes Ativos</p>
            <p className="text-3xl">{ativos}</p>
          </CardContent>
        </Card>
        <Card className="bg-red-100">
          <CardContent className="p-4">
            <p className="text-lg font-semibold">⚠️ Assinantes em Atraso</p>
            <p className="text-3xl">{atrasados}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 mt-6">
        <h2 className="text-xl font-semibold">➕ Novo Cliente</h2>
        <input className="border p-2 rounded" placeholder="Nome" value={novoCliente.nome} onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Telefone" value={novoCliente.telefone} onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })} />
        <input className="border p-2 rounded" type="date" placeholder="Data Inicial" value={novoCliente.inicio} onChange={(e) => setNovoCliente({ ...novoCliente, inicio: e.target.value })} />
        <input className="border p-2 rounded" type="date" placeholder="Vencimento" value={novoCliente.vencimento} onChange={(e) => setNovoCliente({ ...novoCliente, vencimento: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Plano Mensal" value={novoCliente.planoMensal} onChange={(e) => setNovoCliente({ ...novoCliente, planoMensal: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Plano Anual" value={novoCliente.planoAnual} onChange={(e) => setNovoCliente({ ...novoCliente, planoAnual: e.target.value })} />
        <button className="bg-blue-600 text-white p-2 rounded" onClick={adicionarCliente}>Adicionar Cliente</button>
      </div>

      <button className="mt-4 bg-gray-700 text-white p-2 rounded w-fit" onClick={exportarCSV}>⬇️ Exportar Relatório (CSV)</button>

      <div className="mt-6">
        <label className="font-medium mr-2">Filtrar:</label>
        <select className="border p-2 rounded" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="ativos">Ativos</option>
          <option value="atrasados">Atrasados</option>
        </select>
      </div>

      <div className="grid gap-2 mt-4">
        <h2 className="text-xl font-semibold">📑 Lista de Clientes</h2>
        {clientesFiltrados.map((cliente, index) => {
          const vencido = isBefore(new Date(cliente.vencimento), new Date());
          return (
            <Card
              key={index}
              className={`border ${vencido ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"}`}
            >
              <CardContent className="p-4">
                <p><strong>Nome:</strong> {cliente.nome}</p>
                <p><strong>Telefone:</strong> {cliente.telefone}</p>
                <p><strong>Início:</strong> {format(new Date(cliente.inicio), "dd/MM/yyyy")}</p>
                <p><strong>Vencimento:</strong> {format(new Date(cliente.vencimento), "dd/MM/yyyy")}</p>
                <p><strong>Plano Mensal:</strong> R$ {cliente.planoMensal.toFixed(2)}</p>
                <p><strong>Plano Anual:</strong> R$ {cliente.planoAnual.toFixed(2)}</p>
                {vencido ? (
                  <p className="text-red-600 font-bold">
                    ⚠️ Assinatura em atraso!
                    <br />
                    <a
                      href="https://pay.cakto.com.br/cghnksc_344534"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-600"
                    >
                      Realizar pagamento
                    </a>
                  </p>
                ) : (
                  <p className="text-green-700 font-semibold">✅ Pagamento em dia</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
    