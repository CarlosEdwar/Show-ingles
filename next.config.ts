import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   /*
   * Exportação estática para GitHub Pages.
   * Gera arquivos HTML estáticos em vez de usar um servidor Node.js.
   */
  output: "export",

  /*
   * Desativa a otimização de imagens do Next.js.
   * O GitHub Pages é hospedagem estática e não suporta o Image Optimization API.
   */
  images: {
    unoptimized: true,
  },

  /*
   * Adiciona trailing slash nas URLs.
   * Melhora a compatibilidade com servidores estáticos como o GitHub Pages.
   */
  trailingSlash: true,

  /*
   * Caminho base do projeto.
   * Descomente e ajuste se o repositório NÃO for o principal (username.github.io).
   * Exemplo: repo chamado "english-quest" → basePath: "/english-quest"
   */
   basePath: "/english-quest",

  /*
   * Desativa o Strict Mode em produção se necessário para o protótipo.
   * Recomendado manter true para desenvolvimento.
   */
  reactStrictMode: true,

};

export default nextConfig;
