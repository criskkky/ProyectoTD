"use strict";
import User from "../entity/user.entity.js";
import Publication from "../entity/publi.entity.js";
import Region from "../entity/region.entity.js";
import City from "../entity/city.entity.js";
import { populateRegionsAndCities } from "./chileRegionsCities.js";
import { AppDataSource } from "./configDb.js";
import { encryptPassword } from "../helpers/bcrypt.helper.js";

async function createUsers() {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const publiRepository = AppDataSource.getRepository(Publication);
    const regionRepository = AppDataSource.getRepository(Region);
    const cityRepository = AppDataSource.getRepository(City);

    const count = await userRepository.count();
    if (count > 0) return;

    const { cityMap } = await populateRegionsAndCities(regionRepository, cityRepository);

    const cities = Object.values(cityMap);
    const cityIds = cities.map(c => c.id);
    const getRandomCityId = () => cityIds[Math.floor(Math.random() * cityIds.length)];

    const modalidades = ["presencial", "online", "mixta"];
    const estados = ["activo"]; // Solo "activo"

    const sampleUsers = [
      {
        nombres: "Camila Fernanda",
        apellidos: "Soto Reyes",
        rut: "11111111-1",
        email: "camila@example.com",
        publicaciones: [
          {
            titulo: "Taller de Pintura para Principiantes",
            descripcion: "Aprende técnicas básicas de pintura acrílica y óleo en un ambiente relajado. Ideal para personas sin experiencia previa.",
            categoria: "arte",
          },
          {
            titulo: "Clases de Dibujo Artístico",
            descripcion: "Curso práctico de dibujo a mano alzada, figuras humanas y naturaleza muerta. Incluye materiales.",
            categoria: "arte",
          }
        ]
      },
      {
        nombres: "José Antonio",
        apellidos: "Fernández López",
        rut: "22222222-2",
        email: "jose@example.com",
        publicaciones: [
          {
            titulo: "Servicio de Albañilería Profesional",
            descripcion: "Construcción de muros, ampliaciones, reparaciones y terminaciones. Más de 10 años de experiencia en obras residenciales.",
            categoria: "construcción",
          },
          {
            titulo: "Remodelación de Baños y Cocinas",
            descripcion: "Rediseño completo de espacios, instalación de cerámicas y muebles. Trabajo garantizado.",
            categoria: "construcción",
          }
        ]
      },
      {
        nombres: "Valentina Isabel",
        apellidos: "Rojas Díaz",
        rut: "33333333-3",
        email: "valentina@example.com",
        publicaciones: [
          {
            titulo: "Clases Particulares de Matemáticas",
            descripcion: "Refuerzo escolar para enseñanza básica y media. Preparación PSU y pruebas específicas.",
            categoria: "educacion",
          },
          {
            titulo: "Tutorías de Física y Química",
            descripcion: "Sesiones personalizadas para estudiantes con dificultades en ciencias. Metodología práctica y clara.",
            categoria: "educacion",
          }
        ]
      },
      {
        nombres: "Pedro Ignacio",
        apellidos: "Martínez Silva",
        rut: "44444444-4",
        email: "pedro@example.com",
        publicaciones: [
          {
            titulo: "Curso de Inglés Conversacional",
            descripcion: "Mejora tu fluidez oral con clases dinámicas y enfocadas en situaciones reales. Nivel básico e intermedio.",
            categoria: "idiomas",
          },
          {
            titulo: "Preparación para TOEFL y IELTS",
            descripcion: "Entrenamiento intensivo con simulacros y correcciones detalladas. Ideal para postulaciones académicas.",
            categoria: "idiomas",
          }
        ]
      },
      {
        nombres: "Laura Victoria",
        apellidos: "González Vera",
        rut: "55555555-5",
        email: "laura@example.com",
        publicaciones: [
          {
            titulo: "Masajes Descontracturantes a Domicilio",
            descripcion: "Atención personalizada con técnicas de relajación profunda. Zona centro y oriente.",
            categoria: "salud",
          },
          {
            titulo: "Terapias de Reiki y Bienestar",
            descripcion: "Sesiones de energía para armonizar cuerpo y mente. Ambiente acogedor y seguro.",
            categoria: "salud",
          }
        ]
      },
      {
        nombres: "Andrés Manuel",
        apellidos: "Pizarro Peña",
        rut: "66666666-6",
        email: "andres@example.com",
        publicaciones: [
          {
            titulo: "Gasfiter Certificado 24/7",
            descripcion: "Reparaciones de urgencia, detección de fugas, mantenciones preventivas. Atención rápida.",
            categoria: "servicios generales",
          },
          {
            titulo: "Instalación de Calefonts y Lavamanos",
            descripcion: "Trabajo profesional con garantía. Certificación SEC disponible.",
            categoria: "servicios generales",
          }
        ]
      },
      {
        nombres: "Daniela Elisa",
        apellidos: "Navarro Ruiz",
        rut: "77777777-7",
        email: "daniela@example.com",
        publicaciones: [
          {
            titulo: "Desarrollo de Páginas Web Modernas",
            descripcion: "Sitios responsivos, optimizados para SEO, con panel de administración personalizado.",
            categoria: "tecnología",
          },
          {
            titulo: "Tienda Online con Shopify o WooCommerce",
            descripcion: "Implementación rápida de ecommerce con métodos de pago integrados. Asesoría incluida.",
            categoria: "tecnología",
          }
        ]
      },
      {
        nombres: "Felipe Ignacio",
        apellidos: "Contreras Moya",
        rut: "88888888-8",
        email: "felipe@example.com",
        publicaciones: [
          {
            titulo: "Soporte Técnico a Domicilio",
            descripcion: "Reparación de notebooks, instalación de programas, limpieza de virus. Atención rápida.",
            categoria: "tecnología",
          },
          {
            titulo: "Redes para Pymes y Hogares",
            descripcion: "Configuración de redes WiFi, cableado estructurado, seguridad de red básica.",
            categoria: "tecnología",
          }
        ]
      },
      {
        nombres: "Antonia Elisa",
        apellidos: "Muñoz Herrera",
        rut: "99999999-9",
        email: "antonia@example.com",
        publicaciones: [
          {
            titulo: "Taller de Fotografía Creativa",
            descripcion: "Aprende composición, iluminación y edición desde cero. Incluye salidas fotográficas.",
            categoria: "arte",
          },
          {
            titulo: "Curso de Edición con Lightroom y Photoshop",
            descripcion: "Manejo profesional de herramientas Adobe para fotógrafos y diseñadores.",
            categoria: "arte",
          }
        ]
      }
    ];

    for (const user of sampleUsers) {
      const createdUser = await userRepository.save(
        userRepository.create({
          ...user,
          password: await encryptPassword("user1234"),
          rol: "user",
        })
      );

      for (const [index, pub] of user.publicaciones.entries()) {
        await publiRepository.save(
          publiRepository.create({
            titulo: pub.titulo,
            descripcion: pub.descripcion,
            modalidad: modalidades[Math.floor(Math.random() * modalidades.length)],
            estado: "activo", // Siempre activo
            categoria: pub.categoria,
            direccion: `Calle ${index + 1} de ${user.apellidos}`,
            city: getRandomCityId(),
            etiquetas: ["servicio", pub.categoria, user.nombres.split(" ")[0].toLowerCase()],
            contacto_email: user.email,
            contacto_whatsapp: `+5699${Math.floor(10000000 + Math.random() * 89999999)}`,
            contacto_telefono: `+5698${Math.floor(10000000 + Math.random() * 89999999)}`,
            enlace_externo: `https://sistema.com/oferta-${user.nombres.toLowerCase().replace(" ", "-")}-${index + 1}`,
            createdBy: createdUser,
          })
        );
      }
    }

    // Crear usuario administrador
    const adminUser = await userRepository.save(
      userRepository.create({
        nombres: "Admin",
        apellidos: "Principal",
        rut: "12345678-9",
        email: "admin@example.com",
        password: await encryptPassword("admin1234"),
        rol: "admin",
      })
    );

    await publiRepository.save(
      publiRepository.create({
        titulo: "Bienvenido al sistema",
        descripcion: "Esta es una publicación de ejemplo del administrador.",
        modalidad: "online",
        estado: "activo",
        categoria: "tecnología",
        direccion: "Oficina Central",
        city: getRandomCityId(),
        etiquetas: ["admin", "informativo"],
        contacto_email: "admin@example.com",
        contacto_whatsapp: "+569912345678",
        contacto_telefono: "+569812345678",
        enlace_externo: "https://sistema.com/admin-publicacion",
        createdBy: adminUser,
      })
    );

    console.log("* => 9 usuarios con 2 publicaciones y 1 admin con 1 publicación creados exitosamente.");
  } catch (error) {
    console.error("Error al crear usuarios:", error);
  }
}

export { createUsers };
