"use client";

import { useEffect, useState, useRef } from "react";
import {
  Moon,
  MoonStar,
  Clock,
  Share2,
  ChevronUp,
  Calendar,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { JSX } from "react";

interface LuaInfo {
  fase: string;
  iluminacao: number;
  emoji: JSX.Element;
  dataHora: string;
  proximaFase: string;
  proximaData: string;
  diasProximaFase: number;
}

export default function Home() {
  const [luaInfo, setLuaInfo] = useState<LuaInfo>({
    fase: "",
    iluminacao: 0,
    emoji: <Moon className="w-24 h-24 text-white" />,
    dataHora: "",
    proximaFase: "",
    proximaData: "",
    diasProximaFase: 0,
  });
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const detalhesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calcularFaseLua = () => {
      const agora = new Date();
      const dataHoraBrasilia = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(agora);

      // Cálculo mais preciso da fase da lua
      const ano = agora.getFullYear();
      const mes = agora.getMonth() + 1;
      const dia = agora.getDate();

      // Fórmula astronômica simplificada
      const c = Math.floor((ano - 1900) / 100);
      const e = 2 * (ano - 1900) - c + Math.floor(c / 4);
      const f = mes - 14;
      const g = ano - 1900;
      if (f < 0) {
        f += 12;
        g -= 1;
      }
      const a = Math.floor((13.5 * f) / 10) + dia + e + 1;
      const b = a - Math.floor(a / 30) * 30;

      const faseDecimal = b / 30;
      const iluminacao = Math.round(
        50 * (1 - Math.cos(2 * Math.PI * faseDecimal))
      );

      let fase = "";
      let emoji = <Moon className="w-24 h-24 text-white" />;
      let proximaFase = "";
      let diasProximaFase = 0;

      if (faseDecimal < 0.03 || faseDecimal > 0.97) {
        fase = "Lua Nova";
        emoji = <Moon className="w-24 h-24 text-zinc-700" />;
        proximaFase = "Lua Crescente";
        diasProximaFase = Math.ceil((0.25 - faseDecimal) * 29.53);
      } else if (faseDecimal < 0.22) {
        fase = "Lua Crescente";
        emoji = <MoonStar className="w-24 h-24 text-white" />;
        proximaFase = "Lua Cheia";
        diasProximaFase = Math.ceil((0.5 - faseDecimal) * 29.53);
      } else if (faseDecimal < 0.28) {
        fase = "Lua Cheia";
        emoji = <Moon className="w-24 h-24 text-white" />;
        proximaFase = "Lua Minguante";
        diasProximaFase = Math.ceil((0.75 - faseDecimal) * 29.53);
      } else if (faseDecimal < 0.72) {
        fase = "Lua Minguante Gibosa";
        emoji = <MoonStar className="w-24 h-24 text-white" />;
        proximaFase = "Lua Minguante";
        diasProximaFase = Math.ceil((0.75 - faseDecimal) * 29.53);
      } else if (faseDecimal < 0.78) {
        fase = "Lua Minguante";
        emoji = <MoonStar className="w-24 h-24 text-white" />;
        proximaFase = "Lua Nova";
        diasProximaFase = Math.ceil((1 - faseDecimal) * 29.53);
      } else {
        fase = "Lua Minguante";
        emoji = <MoonStar className="w-24 h-24 text-white" />;
        proximaFase = "Lua Nova";
        diasProximaFase = Math.ceil((1 - faseDecimal) * 29.53);
      }

      const proximaData = new Date(
        agora.getTime() + diasProximaFase * 24 * 60 * 60 * 1000
      );
      const proximaDataFormatada = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "numeric",
        month: "long",
      }).format(proximaData);

      setLuaInfo({
        fase,
        iluminacao,
        emoji,
        dataHora: dataHoraBrasilia,
        proximaFase,
        proximaData: proximaDataFormatada,
        diasProximaFase,
      });
    };

    calcularFaseLua();
    const intervalo = setInterval(calcularFaseLua, 60000);
    return () => clearInterval(intervalo);
  }, []);

  const handleCompartilhar = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator
        .share({
          title: "Lua de Hoje",
          text: `A lua de hoje é ${luaInfo.fase} com ${luaInfo.iluminacao}% de iluminação. Próxima fase: ${luaInfo.proximaFase} em ${luaInfo.diasProximaFase} dias.`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Erro ao compartilhar:", err);
        });
    } else if (typeof window !== "undefined") {
      const texto = `A lua de hoje é ${luaInfo.fase} com ${luaInfo.iluminacao}% de iluminação. Próxima fase: ${luaInfo.proximaFase} em ${luaInfo.diasProximaFase} dias. Veja em: ${window.location.href}`;
      navigator.clipboard
        .writeText(texto)
        .then(() => {
          alert("Link copiado para a área de transferência!");
        })
        .catch(() => {
          alert("Não foi possível compartilhar automaticamente");
        });
    }
  };

  const toggleDetalhes = () => {
    setMostrarDetalhes(!mostrarDetalhes);
    if (!mostrarDetalhes && detalhesRef.current) {
      setTimeout(() => {
        detalhesRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const getFaseDescription = (fase: string) => {
    const descricoes: { [key: string]: string } = {
      "Lua Nova":
        "A lua não é visível no céu. É o momento ideal para novos começos e definir intenções.",
      "Lua Crescente":
        "A lua está crescendo em luminosidade. Tempo de crescimento e desenvolvimento de projetos.",
      "Lua Cheia":
        "A lua está completamente iluminada. Momento de culminação, celebração e gratidão.",
      "Lua Minguante Gibosa":
        "A lua está diminuindo após a lua cheia. Tempo de reflexão e liberação.",
      "Lua Minguante":
        "A lua está em fase decrescente. Momento de soltar o que não serve mais.",
    };
    return descricoes[fase] || "Fase lunar em transição.";
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white overflow-x-hidden">
      <div className="container max-w-md px-4 py-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2 text-center">Lua de Hoje</h1>
        <p className="text-zinc-400 mb-8 text-center flex items-center gap-2 justify-center">
          <Clock className="w-4 h-4" /> {luaInfo.dataHora}
        </p>

        <Card className="w-full bg-zinc-900 border-zinc-800 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full opacity-20 blur-xl"></div>
                {luaInfo.emoji}
              </div>

              <div className="text-center">
                <h2 className="text-4xl font-bold mb-2">{luaInfo.fase}</h2>
                <p className="text-xl text-zinc-400">
                  {luaInfo.iluminacao}% de iluminação
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center w-full mb-8">
          <Button
            variant="ghost"
            size="lg"
            className="flex items-center gap-2"
            onClick={handleCompartilhar}
          >
            <Share2 className="w-5 h-5" />
            <span>Compartilhar</span>
          </Button>
        </div>

        <div
          ref={detalhesRef}
          className="w-full space-y-6 animate-in slide-in-from-bottom duration-500"
        >
          <Card className="w-full bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Info className="w-5 h-5 text-white" />
                Sobre esta fase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-300 leading-relaxed">
                {getFaseDescription(luaInfo.fase)}
              </p>
            </CardContent>
          </Card>

          <Card className="w-full bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Calendar className="w-5 h-5 text-white" />
                Próxima fase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Fase:</span>
                  <span className="font-semibold text-white">
                    {luaInfo.proximaFase}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Data:</span>
                  <span className="font-semibold text-white">
                    {luaInfo.proximaData}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Em:</span>
                  <span className="font-semibold text-white">
                    {luaInfo.diasProximaFase}{" "}
                    {luaInfo.diasProximaFase === 1 ? "dia" : "dias"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Moon className="w-5 h-5 text-white" />
                Curiosidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-zinc-300">
                <p>• O ciclo lunar completo dura aproximadamente 29,5 dias</p>
                <p>• A lua influencia as marés dos oceanos</p>
                <p>• A mesma face da lua sempre está voltada para a Terra</p>
                <p>• A lua se afasta da Terra cerca de 3,8 cm por ano</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-zinc-600 text-xs py-4">
            <p>Dados calculados para o fuso horário de Brasília</p>
          </div>
        </div>
      </div>
    </main>
  );
}
