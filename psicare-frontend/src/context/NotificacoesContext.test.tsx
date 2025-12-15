import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NotificacoesProvider, useNotificacoes } from './NotificacoesContext';
import '@testing-library/jest-dom';

// === MOCK: PacientesContext ===
// Impede erro no .filter() de aniversariantes
vi.mock('./PacientesContext', () => ({
  usePacientes: () => ({
    pacientes: [], 
  }),
}));

// === MOCK: AgendamentosContext (NOVO) ===
// Impede erro no .forEach() de agendamentos próximos
vi.mock('./AgendamentosContext', () => ({
  useAgendamentos: () => ({
    agendamentos: [],
  }),
}));

const TestComponent = () => {
  const { notificacoes, adicionarNotificacao, marcarComoLida, removerNotificacao, naoLidasCount } = useNotificacoes();

  return (
    <div>
      <div data-testid="count">{naoLidasCount}</div>
      <ul>
        {notificacoes.map((n) => (
          <li key={n.id} data-testid={`notif-${n.id}`}>
            {n.titulo} - {n.lida ? 'Lida' : 'Não lida'}
            <button onClick={() => marcarComoLida(n.id)}>Ler</button>
            <button onClick={() => removerNotificacao(n.id)}>Remover</button>
          </li>
        ))}
      </ul>
      <button
        onClick={() =>
          adicionarNotificacao({
            titulo: 'Teste',
            mensagem: 'Mensagem de teste',
            tipo: 'agendamento', 
          })
        }
      >
        Adicionar
      </button>
    </div>
  );
};

describe('NotificacoesContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve adicionar uma notificação', () => {
    render(
      <NotificacoesProvider>
        <TestComponent />
      </NotificacoesProvider>
    );

    const addButton = screen.getByText('Adicionar');
    
    act(() => {
      addButton.click();
    });

    expect(screen.getByText('Teste - Não lida')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('deve marcar uma notificação como lida', () => {
    render(
      <NotificacoesProvider>
        <TestComponent />
      </NotificacoesProvider>
    );

    const addButton = screen.getByText('Adicionar');
    act(() => {
      addButton.click();
    });

    const readButton = screen.getByText('Ler');
    act(() => {
      readButton.click();
    });

    expect(screen.getByText('Teste - Lida')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('deve remover uma notificação', () => {
    render(
      <NotificacoesProvider>
        <TestComponent />
      </NotificacoesProvider>
    );

    const addButton = screen.getByText('Adicionar');
    act(() => {
      addButton.click();
    });

    const removeButton = screen.getByText('Remover');
    act(() => {
      removeButton.click();
    });

    expect(screen.queryByText('Teste - Não lida')).not.toBeInTheDocument();
    expect(screen.queryByText('Teste - Lida')).not.toBeInTheDocument();
  });
});