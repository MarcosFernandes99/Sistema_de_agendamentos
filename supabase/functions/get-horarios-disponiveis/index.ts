// CÓDIGO ORIGINAL RESTAURADO
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestPayload {
  data: string;
  servicoId: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: RequestPayload = await req.json();
    const { data: dataSelecionada, servicoId } = payload;
    
    if (!dataSelecionada || !servicoId) {
      throw new Error("A data e o ID do serviço são obrigatórios.");
    }
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: agendamentosExistentes, error: agendamentosError } = await supabaseAdmin
      .from('agendamentos')
      .select('data_hora_inicio')
      .gte('data_hora_inicio', `${dataSelecionada}T00:00:00.000Z`) // Maior ou igual ao início do dia
      .lte('data_hora_inicio', `${dataSelecionada}T23:59:59.999Z`); // Menor ou igual ao fim do dia

    const { data: servico, error: servicoError } = await supabaseAdmin
      .from('servicos')
      .select('duracao_minutos')
      .eq('id', servicoId)
      .maybeSingle(); // Usando a versão mais segura

    if (agendamentosError || servicoError) throw agendamentosError || servicoError;
    if (!servico) throw new Error(`Serviço com ID ${servicoId} não encontrado.`);

    // ... resto da sua lógica para calcular horários ...
    const horarioInicio = 9;
    const horarioFim = 18;
    const intervalo = servico.duracao_minutos;
    const horariosDisponiveis = [];
    const horariosOcupados = new Set(agendamentosExistentes.map(a => new Date(a.data_hora_inicio).getTime()));

    for (let hora = horarioInicio; hora < horarioFim; hora++) {
      for (let minuto = 0; minuto < 60; minuto += intervalo) {
        const dataSlot = new Date(`${dataSelecionada}T${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}:00`);
        
        if (dataSlot.getTime() > new Date().getTime() && !horariosOcupados.has(dataSlot.getTime())) {
          horariosDisponiveis.push(dataSlot.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        }
      }
    }
    
    return new Response(
      JSON.stringify({ horarios: horariosDisponiveis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})