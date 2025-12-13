import '@testing-library/jest-dom'; 
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NotificacoesProvider, useNotificacoes } from './NotificacoesContext';
import * as PacientesContext from './PacientesContext';
import * as AgendamentosContext from './AgendamentosContext';

// Tipo auxiliar para não usar 'any'
type NotificacoesHookType = ReturnType<typeof useNotificacoes>;

// Mocks
const usePacientesMock = vi.fn();
const useAgendamentosMock = vi.fn();

vi.mock('./PacientesContext', async (importOriginal) => {
  const actual = await importOriginal<typeof PacientesContext>();
  return { ...actual, usePacientes: () => usePacientesMock() };
});

vi.mock('./AgendamentosContext', async (importOriginal) => {
  const actual = await importOriginal<typeof AgendamentosContext>();
  return { ...actual, useAgendamentos: () => useAgendamentosMock() };
});

// Componente de teste tipado corretamente
function TestComponent({ onMount }: { onMount?: (hook: NotificacoesHookType) => void }) {
  const hook = useNotificacoes();
  if (onMount) onMount(hook);
  
  return (
    <div>
      <div data-testid="count">{hook.naoLidasCount}</div>
      <ul>
        {hook.notificacoes.map(n => (
          <li key={n.id} data-testid={`notificacao-${n.id}`}>
            {n.titulo} - {n.lida ? 'Lida' : 'Não lida'}
          </li>
        ))}
      </ul>
      <button onClick={() => hook.adicionarNotificacao({ 
        titulo: 'Teste Manual', 
        mensagem: 'Msg', 
        tipo: 'sistema' 
      })}>
        Add
      </button>
      <button onClick={hook.marcarTodasComoLidas}>Ler Todas</button>
    </div>
  );
}

describe('NotificacoesContext', () => {
  const DATA_TESTE = new Date('2025-10-20T10:00:00');

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(DATA_TESTE);
    
    usePacientesMock.mockReturnValue({ pacientes: [] });
    useAgendamentosMock.mockReturnValue({ agendamentos: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('deve iniciar sem notificações', () => {
    render(
      <NotificacoesProvider>
        <TestComponent />
      </NotificacoesProvider>
    );
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('deve permitir adicionar uma notificação manual', () => {
    render(
      <NotificacoesProvider>
        <TestComponent />
      </NotificacoesProvider>
    );

    const btnAdd = screen.getByText('Add');
    
    act(() => {
      btnAdd.click();
    });

    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByText(/Teste Manual/)).toBeInTheDocument();
  });

  it('deve marcar notificações como lidas', () => {
    // Correção do 'any': tipagem explícita ou inferida
    let hookValues: NotificacoesHookType | undefined;
    
    render(
      <NotificacoesProvider>
        <TestComponent onMount={(val) => { hookValues = val; }} />
      </NotificacoesProvider>
    );

    // Adiciona
    act(() => {
      hookValues?.adicionarNotificacao({ titulo: 'Teste', mensagem: 'M', tipo: 'sistema' });
    });
    
    // Marca como lida
    act(() => {
      if (hookValues && hookValues.notificacoes.length > 0) {
        hookValues.marcarComoLida(hookValues.notificacoes[0].id);
      }
    });

    expect(screen.getByText(/Teste - Lida/)).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  // --- TESTES DE AUTOMAÇÃO ---

  it('deve gerar notificação automática de ANIVERSÁRIO', () => {
    usePacientesMock.mockReturnValue({
      pacientes: [{
        id: '1',
        nome: 'João Silva',
        dataNascimento: '1990-10-20', 
      }]
    });

    render(
      <NotificacoesProvider>
        <TestComponent />
      </NotificacoesProvider>
    );

    expect(screen.getByText(/Aniversariante do Dia/)).toBeInTheDocument();
    expect(screen.getByText(/João Silva/)).toBeInTheDocument();
  });

  it('deve gerar notificação automática de SESSÃO PRÓXIMA (dentro de 60min)', () => {
    useAgendamentosMock.mockReturnValue({
      agendamentos: [{
        id: '1',
        pacienteNome: 'Maria',
        data: '2025-10-20',
        hora: '10:30', // 30 min depois da hora simulada (10:00)
        status: 'agendado'
      }]
    });

    render(
      <NotificacoesProvider>
        <TestComponent />
      </NotificacoesProvider>
    );

    expect(screen.getByText(/Sessão em Breve/)).toBeInTheDocument();
    expect(screen.getByText(/Maria/)).toBeInTheDocument();
  });

  it('NÃO deve gerar notificação se a sessão for muito distante (> 60min)', () => {
    useAgendamentosMock.mockReturnValue({
      agendamentos: [{
        id: '1',
        pacienteNome: 'Maria',
        data: '2025-10-20',
        hora: '12:00', // 2 horas depois
        status: 'agendado'
      }]
    });

    render(
      <NotificacoesProvider>
        <TestComponent />
      </NotificacoesProvider>
    );

    expect(screen.queryByText(/Sessão em Breve/)).not.toBeInTheDocument();
  });
});