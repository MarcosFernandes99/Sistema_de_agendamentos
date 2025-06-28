// supabase/functions/get-horarios-disponiveis/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Define o formato esperado dos dados recebidos
interface RequestPayload {
  data: string; // Formato: "YYYY-MM-DD"
  servicoId: number;
}

serve(async (req) => {
  // Configuração para permitir chamadas do seu app front-end (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' } })
  }

  try {
    const payload: RequestPayload = await req.json();
    const { data: dataSelecionada, servicoId } = payload;
    
    if (!dataSelecionada || !servicoId) throw new Error("Data e ID do serviço são obrigatórios.");

    // Inicializa o cliente Supabase com permissões de administrador
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Busca os agendamentos já feitos para o dia e a duração do serviço selecionado
    const { data: agendamentosExistentes, error: agendamentosError } = await supabaseAdmin
      .from('Agendamentos')
      .select('data_hora')
      .like('data_hora', `${dataSelecionada}%`);

    const { data: servico, error: servicoError } = await supabaseAdmin
      .from('Servicos')
      .select('duracao_minutos')
      .eq('id', servicoId)
      .single();

    if (agendamentosError || servicoError) throw agendamentosError || servicoError;
    if (!servico) throw new Error("Serviço não encontrado.");

    // Lógica para gerar e filtrar os horários
    const horarioInicio = 9;  // 9:00
    const horarioFim = 18;    // 18:00
    const intervalo = servico.duracao_minutos;

    const horariosDisponiveis = [];
    const horariosOcupados = new Set(agendamentosExistentes.map(a => new Date(a.data_hora).getTime()));

    for (let hora = horarioInicio; hora < horarioFim; hora++) {
      for (let minuto = 0; minuto < 60; minuto += intervalo) {
        const dataSlot = new Date(`${dataSelecionada}T${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}:00`);
        
        // Verifica se o horário ainda não passou e se não está ocupado
        if (dataSlot.getTime() > new Date().getTime() && !horariosOcupados.has(dataSlot.getTime())) {
          horariosDisponiveis.push(dataSlot.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        }
      }
    }
    
    // Retorna a lista de horários livres
    return new Response(
      JSON.stringify({ horarios: horariosDisponiveis }),
      { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }
})

